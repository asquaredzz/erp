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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const reservation_entity_1 = require("./reservation.entity");
const inventory_service_1 = require("../inventory/inventory.service");
const inventory_level_entity_1 = require("../inventory/entities/inventory-level.entity");
const inventory_transaction_entity_1 = require("../inventory/entities/inventory-transaction.entity");
let OrdersService = class OrdersService {
    constructor(dataSource, orderRepo, itemRepo, resRepo, inventorySvc) {
        this.dataSource = dataSource;
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.resRepo = resRepo;
        this.inventorySvc = inventorySvc;
    }
    async createOrder(orderPayload, items) {
        return this.dataSource.transaction(async (manager) => {
            const order = manager.create(order_entity_1.Order, orderPayload);
            const savedOrder = await manager.save(order);
            for (const it of items) {
                const item = manager.create(order_item_entity_1.OrderItem, { ...it, order_id: savedOrder.id });
                await manager.save(item);
                const levels = await this.inventorySvc.levelRepo.find({ where: { sku_id: item.sku_id } });
                let remaining = Number(item.quantity);
                for (const lvl of levels) {
                    const available = Number(lvl.quantity_on_hand) - Number(lvl.quantity_reserved);
                    if (available <= 0)
                        continue;
                    const take = Math.min(available, remaining);
                    if (take <= 0)
                        continue;
                    const res = manager.create(reservation_entity_1.Reservation, { order_id: savedOrder.id, sku_id: item.sku_id, warehouse_id: lvl.warehouse_id, quantity: take });
                    await manager.save(res);
                    lvl.quantity_reserved = Number(lvl.quantity_reserved) + take;
                    await manager.save(lvl);
                    remaining -= take;
                    if (remaining <= 0)
                        break;
                }
                if (remaining > 0) {
                    throw new Error('Insufficient stock for SKU ' + item.sku_id);
                }
            }
            return savedOrder;
        });
    }
    async releaseReservationsForOrder(orderId) {
        return this.dataSource.transaction(async (manager) => {
            const resList = await manager.find(reservation_entity_1.Reservation, { where: { order_id: orderId } });
            for (const r of resList) {
                const lvl = await manager.findOneBy(inventory_level_entity_1.InventoryLevel, { sku_id: r.sku_id, warehouse_id: r.warehouse_id });
                if (lvl) {
                    lvl.quantity_reserved = Number(lvl.quantity_reserved) - Number(r.quantity);
                    if (lvl.quantity_reserved < 0)
                        lvl.quantity_reserved = 0;
                    await manager.save(lvl);
                }
                await manager.delete(reservation_entity_1.Reservation, { id: r.id });
            }
        });
    }
    async finalizeOrder(orderId) {
        const { FinalizeService } = await Promise.resolve().then(() => require('./finalize.service'));
        const resRepo = this.dataSource.getRepository(reservation_entity_1.Reservation);
        const txnRepo = this.dataSource.getRepository(inventory_transaction_entity_1.InventoryTransaction);
        const lvlRepo = this.dataSource.getRepository(inventory_level_entity_1.InventoryLevel);
        const orderRepo = this.dataSource.getRepository(order_entity_1.Order);
        const ds = new FinalizeService(this.dataSource, resRepo, txnRepo, lvlRepo, orderRepo);
        return ds.finalize(orderId);
    }
};
OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(3, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        inventory_service_1.InventoryService])
], OrdersService);
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map