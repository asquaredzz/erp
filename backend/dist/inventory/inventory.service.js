"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sku_entity_1 = require("./entities/sku.entity");
const barcode_entity_1 = require("./entities/barcode.entity");
const inventory_level_entity_1 = require("./entities/inventory-level.entity");
const inventory_transaction_entity_1 = require("./entities/inventory-transaction.entity");
let InventoryService = class InventoryService {
    constructor(skuRepo, barcodeRepo, levelRepo, txnRepo) {
        this.skuRepo = skuRepo;
        this.barcodeRepo = barcodeRepo;
        this.levelRepo = levelRepo;
        this.txnRepo = txnRepo;
    }
    async getSkuById(id) {
        return this.skuRepo.findOneBy({ id });
    }
    async findSkuByBarcode(code) {
        const bc = await this.barcodeRepo.findOneBy({ code });
        if (!bc)
            return null;
        const sku = await this.skuRepo.findOneBy({ id: bc.sku_id });
        const levels = await this.levelRepo.find({ where: { sku_id: bc.sku_id } });
        return { barcode: bc, sku, levels };
    }
    async createTransaction(payload) {
        const txn = this.txnRepo.create(payload);
        const saved = await this.txnRepo.save(txn);
        if (saved.sku_id && saved.warehouse_id) {
            const where = { sku_id: saved.sku_id, warehouse_id: saved.warehouse_id };
            if (payload['bin_id'])
                where.bin_id = payload['bin_id'];
            const level = await this.levelRepo.findOneBy(where);
            if (level) {
                level.quantity_on_hand = Number(level.quantity_on_hand) + Number(saved.change);
                await this.levelRepo.save(level);
            }
            else {
                await this.levelRepo.save(this.levelRepo.create({ ...where, quantity_on_hand: Math.max(saved.change, 0) }));
            }
        }
        return saved;
    }
};
InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sku_entity_1.Sku)),
    __param(1, (0, typeorm_1.InjectRepository)(barcode_entity_1.Barcode)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_level_entity_1.InventoryLevel)),
    __param(3, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map