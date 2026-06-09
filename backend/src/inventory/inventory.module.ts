import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sku } from './entities/sku.entity';
import { Barcode } from './entities/barcode.entity';
import { Warehouse } from './entities/warehouse.entity';
import { InventoryLevel } from './entities/inventory-level.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sku, Barcode, Warehouse, InventoryLevel, InventoryTransaction])],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}

