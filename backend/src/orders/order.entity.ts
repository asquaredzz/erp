import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  external_order_no: string | null;

  @Column({ type: 'uuid', nullable: true })
  customer_id: string | null;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ nullable: true })
  channel: string | null;

  @Column({ type: 'numeric', default: 0 })
  total_amount: number;

  @Column({ nullable: true })
  currency: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
