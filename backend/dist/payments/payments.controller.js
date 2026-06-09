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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
const inventory_service_1 = require("../inventory/inventory.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PaymentsController = class PaymentsController {
    constructor(ordersSvc, inventorySvc) {
        this.ordersSvc = ordersSvc;
        this.inventorySvc = inventorySvc;
    }
    async paymentWebhook(body) {
        const { order_id, status } = body;
        if (status === 'COMPLETED') {
            await this.ordersSvc.finalizeOrder(order_id);
            return { ok: true };
        }
        return { ok: false };
    }
};
__decorate([
    (0, common_1.Post)('webhook'),
    (0, roles_decorator_1.Roles)('Finance', 'Admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paymentWebhook", null);
PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService, inventory_service_1.InventoryService])
], PaymentsController);
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments.controller.js.map