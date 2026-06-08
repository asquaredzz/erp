import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku } from './entities/sku.entity';
import { Barcode } from './entities/barcode.entity';
import { InventoryLevel } from './entities/inventory-level.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Sku) private skuRepo: Repository<Sku>,
    @InjectRepository(Barcode) private barcodeRepo: Repository<Barcode>,
    @InjectRepository(InventoryLevel) public levelRepo: Repository<InventoryLevel>,
    @InjectRepository(InventoryTransaction) private txnRepo: Repository<InventoryTransaction>
  ) {}

  async getSkuById(id: string) {
    return this.skuRepo.findOneBy({ id });
  }

  async findSkuByBarcode(code: string) {
    const bc = await this.barcodeRepo.findOneBy({ code });
    if (!bc) return null;
    const sku = await this.skuRepo.findOneBy({ id: bc.sku_id });
    const levels = await this.levelRepo.find({ where: { sku_id: bc.sku_id } });
    return { barcode: bc, sku, levels };
  }

  async createTransaction(payload: Partial<InventoryTransaction>) {
    const txn = this.txnRepo.create(payload as InventoryTransaction);
    const saved = await this.txnRepo.save(txn);

    // Basic sync: update inventory_levels row
    if (saved.sku_id && saved.warehouse_id) {
      const where: any = { sku_id: saved.sku_id, warehouse_id: saved.warehouse_id };
      if (payload['bin_id']) where.bin_id = payload['bin_id'];

      const level = await this.levelRepo.findOneBy(where);
      if (level) {
        level.quantity_on_hand = Number(level.quantity_on_hand) + Number(saved.change);
        await this.levelRepo.save(level);
      } else {
        await this.levelRepo.save(this.levelRepo.create({ ...where, quantity_on_hand: Math.max(saved.change, 0) }));
      }
    }

    return saved;
  }
}
