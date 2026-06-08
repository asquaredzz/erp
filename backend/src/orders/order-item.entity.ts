import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'uuid', nullable: true })
  sku_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  barcode_id: string | null;

  @Column({ type: 'numeric', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', nullable: true })
  unit_price: number | null;

  @Column({ type: 'numeric', default: 0 })
  discount: number;

  @Column({ type: 'numeric', default: 0 })
  tax: number;
}
