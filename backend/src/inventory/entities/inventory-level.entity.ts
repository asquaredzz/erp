import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'inventory_levels' })
export class InventoryLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sku_id: string;

  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Column({ type: 'uuid', nullable: true })
  bin_id: string | null;

  @Column({ type: 'numeric', default: 0 })
  quantity_on_hand: number;

  @Column({ type: 'numeric', default: 0 })
  quantity_reserved: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_restock_at: Date | null;
}
