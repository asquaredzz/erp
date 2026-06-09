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
exports.PurchaseOrderItem = void 0;
const typeorm_1 = require("typeorm");
let PurchaseOrderItem = class PurchaseOrderItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "purchase_order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "sku_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unit_price", void 0);
PurchaseOrderItem = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_order_items' })
], PurchaseOrderItem);
exports.PurchaseOrderItem = PurchaseOrderItem;
//# sourceMappingURL=purchase-order-item.entity.js.map