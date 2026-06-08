import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(PurchaseOrder) private poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem) private poiRepo: Repository<PurchaseOrderItem>,
    @InjectRepository(Supplier) private supRepo: Repository<Supplier>
  ) {}

  async createPurchaseOrder(sku_id: string, quantity: number) {
    // Choose first supplier as placeholder
    const suppliers = await this.supRepo.find();
    const supplier = suppliers.length ? suppliers[0] : null;
    const po = this.poRepo.create({ supplier_id: supplier ? supplier.id : null, status: 'DRAFT', total_amount: 0 });
    const saved = await this.poRepo.save(po);
    const item = this.poiRepo.create({ purchase_order_id: saved.id, sku_id, quantity, unit_price: 0 });
    await this.poiRepo.save(item);
    return { purchase_order: saved, item };
  }
}
