"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sku_entity_1 = require("./entities/sku.entity");
const barcode_entity_1 = require("./entities/barcode.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const inventory_level_entity_1 = require("./entities/inventory-level.entity");
const inventory_transaction_entity_1 = require("./entities/inventory-transaction.entity");
const inventory_service_1 = require("./inventory.service");
const inventory_controller_1 = require("./inventory.controller");
let InventoryModule = class InventoryModule {
};
InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sku_entity_1.Sku, barcode_entity_1.Barcode, warehouse_entity_1.Warehouse, inventory_level_entity_1.InventoryLevel, inventory_transaction_entity_1.InventoryTransaction])],
        providers: [inventory_service_1.InventoryService],
        controllers: [inventory_controller_1.InventoryController]
    })
], InventoryModule);
exports.InventoryModule = InventoryModule;
//# sourceMappingURL=inventory.module.js.map