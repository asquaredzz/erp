import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Reservation } from './reservation.entity';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryLevel } from '../inventory/entities/inventory-level.entity';
import { InventoryTransaction } from '../inventory/entities/inventory-transaction.entity';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Reservation) private resRepo: Repository<Reservation>,
    private inventorySvc: InventoryService
  ) {}

  async createOrder(orderPayload: Partial<Order>, items: Partial<OrderItem>[]) {
    return this.dataSource.transaction(async manager => {
      const order = manager.create(Order, orderPayload);
      const savedOrder = await manager.save(order);

      for (const it of items) {
        const item = manager.create(OrderItem, { ...it, order_id: savedOrder.id });
        await manager.save(item);

        // Try to reserve stock (simple: pick first warehouse with availability)
        const levels = await this.inventorySvc.levelRepo.find({ where: { sku_id: item.sku_id } });
        let remaining = Number(item.quantity);
        for (const lvl of levels) {
          const available = Number(lvl.quantity_on_hand) - Number(lvl.quantity_reserved);
          if (available <= 0) continue;
          const take = Math.min(available, remaining);
          if (take <= 0) continue;
          // create reservation
          const res = manager.create(Reservation, { order_id: savedOrder.id, sku_id: item.sku_id, warehouse_id: lvl.warehouse_id, quantity: take });
          await manager.save(res);
          // update inventory_level reserved
          lvl.quantity_reserved = Number(lvl.quantity_reserved) + take;
          await manager.save(lvl);
          remaining -= take;
          if (remaining <= 0) break;
        }

        if (remaining > 0) {
          // Not enough stock — leave as backorder or throw
          // For now, throw to rollback transaction
          throw new Error('Insufficient stock for SKU ' + item.sku_id);
        }
      }

      return savedOrder;
    });
  }

  async releaseReservationsForOrder(orderId: string) {
    return this.dataSource.transaction(async manager => {
      const resList = await manager.find(Reservation, { where: { order_id: orderId } });
      for (const r of resList) {
        const lvl = await manager.findOneBy(InventoryLevel, { sku_id: r.sku_id, warehouse_id: r.warehouse_id });
        if (lvl) {
          lvl.quantity_reserved = Number(lvl.quantity_reserved) - Number(r.quantity);
          if (lvl.quantity_reserved < 0) lvl.quantity_reserved = 0;
          await manager.save(lvl);
        }
        await manager.delete(Reservation, { id: r.id });
      }
    });
  }

  // Finalize an order by converting reservations into SALE transactions and updating stock
  async finalizeOrder(orderId: string) {
    // delegate to FinalizeService if available to keep responsibilities clean
    // lazy require to avoid circular deps in this scaffold
    const { FinalizeService } = await import('./finalize.service');
    const resRepo = this.dataSource.getRepository(Reservation);
    const txnRepo = this.dataSource.getRepository(InventoryTransaction);
    const lvlRepo = this.dataSource.getRepository(InventoryLevel);
    const orderRepo = this.dataSource.getRepository(Order);
    const ds = new FinalizeService(this.dataSource, resRepo as any, txnRepo as any, lvlRepo as any, orderRepo as any);
    return ds.finalize(orderId);
  }
}
