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
exports.PurchaseOrder = void 0;
const typeorm_1 = require("typeorm");
let PurchaseOrder = class PurchaseOrder {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplier_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "external_po_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "created_at", void 0);
PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_orders' })
], PurchaseOrder);
exports.PurchaseOrder = PurchaseOrder;
//# sourceMappingURL=purchase-order.entity.js.map