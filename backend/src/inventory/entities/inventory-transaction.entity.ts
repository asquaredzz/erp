import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'inventory_transactions' })
export class InventoryTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  sku_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  warehouse_id: string | null;

  @Column({ type: 'numeric' })
  change: number;

  @Column({ type: 'text' })
  event_type: string;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'text', nullable: true })
  batch_reference: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  serial_numbers: string[] | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
