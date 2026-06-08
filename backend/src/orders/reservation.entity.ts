import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'uuid' })
  sku_id: string;

  @Column({ type: 'uuid', nullable: true })
  warehouse_id: string | null;

  @Column({ type: 'numeric' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
