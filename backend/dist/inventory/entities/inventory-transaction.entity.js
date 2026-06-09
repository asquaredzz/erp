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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransaction = void 0;
const typeorm_1 = require("typeorm");
let InventoryTransaction = class InventoryTransaction {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "sku_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], InventoryTransaction.prototype, "change", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "event_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "batch_reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], InventoryTransaction.prototype, "serial_numbers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], InventoryTransaction.prototype, "created_at", void 0);
InventoryTransaction = __decorate([
    (0, typeorm_1.Entity)({ name: 'inventory_transactions' })
], InventoryTransaction);
exports.InventoryTransaction = InventoryTransaction;
//# sourceMappingURL=inventory-transaction.entity.js.map