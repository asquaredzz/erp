import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'purchase_order_items' })
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchase_order_id: string;

  @Column({ type: 'uuid', nullable: true })
  sku_id: string | null;

  @Column({ type: 'numeric' })
  quantity: number;

  @Column({ type: 'numeric', default: 0 })
  unit_price: number;
}
