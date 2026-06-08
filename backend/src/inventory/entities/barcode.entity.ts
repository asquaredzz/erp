import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity({ name: 'barcodes' })
export class Barcode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sku_id: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ type: 'jsonb', nullable: true })
  meta: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
