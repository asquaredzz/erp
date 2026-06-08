import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'purchase_orders' })
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  supplier_id: string | null;

  @Column({ nullable: true })
  external_po_no: string | null;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ type: 'numeric', default: 0 })
  total_amount: number;

  @Column({ nullable: true })
  currency: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
