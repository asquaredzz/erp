import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Reservation } from './reservation.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { FinalizeService } from './finalize.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Reservation]), InventoryModule],
  providers: [OrdersService, FinalizeService],
  controllers: [OrdersController]
})
export class OrdersModule {}
