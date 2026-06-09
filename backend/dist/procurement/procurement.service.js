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
exports.ProcurementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const purchase_order_item_entity_1 = require("./entities/purchase-order-item.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
let ProcurementService = class ProcurementService {
    constructor(poRepo, poiRepo, supRepo) {
        this.poRepo = poRepo;
        this.poiRepo = poiRepo;
        this.supRepo = supRepo;
    }
    async createPurchaseOrder(sku_id, quantity) {
        const suppliers = await this.supRepo.find();
        const supplier = suppliers.length ? suppliers[0] : null;
        const po = this.poRepo.create({ supplier_id: supplier ? supplier.id : null, status: 'DRAFT', total_amount: 0 });
        const saved = await this.poRepo.save(po);
        const item = this.poiRepo.create({ purchase_order_id: saved.id, sku_id, quantity, unit_price: 0 });
        await this.poiRepo.save(item);
        return { purchase_order: saved, item };
    }
};
ProcurementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_item_entity_1.PurchaseOrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProcurementService);
exports.ProcurementService = ProcurementService;
//# sourceMappingURL=procurement.service.js.map