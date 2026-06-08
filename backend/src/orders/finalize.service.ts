import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { InventoryTransaction } from '../inventory/entities/inventory-transaction.entity';
import { InventoryLevel } from '../inventory/entities/inventory-level.entity';
import { Order } from './order.entity';

@Injectable()
export class FinalizeService {
  constructor(private dataSource: DataSource,
    @InjectRepository(Reservation) private resRepo: Repository<Reservation>,
    @InjectRepository(InventoryTransaction) private txnRepo: Repository<InventoryTransaction>,
    @InjectRepository(InventoryLevel) private lvlRepo: Repository<InventoryLevel>,
    @InjectRepository(Order) private orderRepo: Repository<Order>
  ) {}

  async finalize(orderId: string) {
    return this.dataSource.transaction(async manager => {
      const order = await manager.findOne(Order, { where: { id: orderId } });
      if (!order) throw new Error('Order not found');

      const reservations = await manager.find(Reservation, { where: { order_id: orderId } });
      for (const r of reservations) {
        // create SALE transaction
        const txn = manager.create(InventoryTransaction, {
          sku_id: r.sku_id,
          warehouse_id: r.warehouse_id,
          change: -Math.abs(Number(r.quantity)),
          event_type: 'SALE',
          related_order_id: orderId
        } as any);
        await manager.save(txn);

        // reduce reserved and on-hand
        const lvl = await manager.findOne(InventoryLevel, { where: { sku_id: r.sku_id, warehouse_id: r.warehouse_id } });
        if (lvl) {
          lvl.quantity_reserved = Number(lvl.quantity_reserved) - Number(r.quantity);
          if (lvl.quantity_reserved < 0) lvl.quantity_reserved = 0;
          lvl.quantity_on_hand = Number(lvl.quantity_on_hand) - Number(r.quantity);
          if (lvl.quantity_on_hand < 0) lvl.quantity_on_hand = 0;
          await manager.save(lvl);
          // Emit low-stock event if below threshold (publish to Redis channel)
          const remaining = Number(lvl.quantity_on_hand);
          const threshold = 10; // configurable in prod
          if (remaining <= threshold) {
            try {
              const Redis = require('ioredis');
              const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
              const payload = { type: 'LOW_STOCK', sku_id: r.sku_id, quantity: remaining, reorder_qty: threshold * 5 };
              await redis.publish('automation:events', JSON.stringify(payload));
              await redis.quit();
            } catch (e) {
              // log but don't fail finalize
            }
          }
        }
        await manager.delete(Reservation, { id: r.id });
      }

      order.status = 'PAID';
      await manager.save(order);
      return order;
    });
  }
}
