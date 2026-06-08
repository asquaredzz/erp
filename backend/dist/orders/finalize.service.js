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
exports.FinalizeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const inventory_transaction_entity_1 = require("../inventory/entities/inventory-transaction.entity");
const inventory_level_entity_1 = require("../inventory/entities/inventory-level.entity");
const order_entity_1 = require("./order.entity");
let FinalizeService = class FinalizeService {
    constructor(dataSource, resRepo, txnRepo, lvlRepo, orderRepo) {
        this.dataSource = dataSource;
        this.resRepo = resRepo;
        this.txnRepo = txnRepo;
        this.lvlRepo = lvlRepo;
        this.orderRepo = orderRepo;
    }
    async finalize(orderId) {
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(order_entity_1.Order, { where: { id: orderId } });
            if (!order)
                throw new Error('Order not found');
            const reservations = await manager.find(reservation_entity_1.Reservation, { where: { order_id: orderId } });
            for (const r of reservations) {
                const txn = manager.create(inventory_transaction_entity_1.InventoryTransaction, {
                    sku_id: r.sku_id,
                    warehouse_id: r.warehouse_id,
                    change: -Math.abs(Number(r.quantity)),
                    event_type: 'SALE',
                    related_order_id: orderId
                });
                await manager.save(txn);
                const lvl = await manager.findOne(inventory_level_entity_1.InventoryLevel, { where: { sku_id: r.sku_id, warehouse_id: r.warehouse_id } });
                if (lvl) {
                    lvl.quantity_reserved = Number(lvl.quantity_reserved) - Number(r.quantity);
                    if (lvl.quantity_reserved < 0)
                        lvl.quantity_reserved = 0;
                    lvl.quantity_on_hand = Number(lvl.quantity_on_hand) - Number(r.quantity);
                    if (lvl.quantity_on_hand < 0)
                        lvl.quantity_on_hand = 0;
                    await manager.save(lvl);
                    const remaining = Number(lvl.quantity_on_hand);
                    const threshold = 10;
                    if (remaining <= threshold) {
                        try {
                            const Redis = require('ioredis');
                            const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
                            const payload = { type: 'LOW_STOCK', sku_id: r.sku_id, quantity: remaining, reorder_qty: threshold * 5 };
                            await redis.publish('automation:events', JSON.stringify(payload));
                            await redis.quit();
                        }
                        catch (e) {
                        }
                    }
                }
                await manager.delete(reservation_entity_1.Reservation, { id: r.id });
            }
            order.status = 'PAID';
            await manager.save(order);
            return order;
        });
    }
};
FinalizeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransaction)),
    __param(3, (0, typeorm_1.InjectRepository)(inventory_level_entity_1.InventoryLevel)),
    __param(4, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FinalizeService);
exports.FinalizeService = FinalizeService;
//# sourceMappingURL=finalize.service.js.map