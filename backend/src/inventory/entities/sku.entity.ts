import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';

@Entity({ name: 'skus' })
export class Sku {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku_code: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ nullable: true })
  category: string | null;

  @Column({ nullable: true })
  subcategory: string | null;

  @Column({ nullable: true })
  brand: string | null;

  @Column({ type: 'jsonb', nullable: true })
  variant: any;

  @Column({ nullable: true })
  parent_sku: string | null;

  @Column({ default: false })
  track_serial: boolean;

  @Column({ default: false })
  track_batch: boolean;

  @Column({ default: false })
  track_expiry: boolean;

  @Column({ type: 'numeric', nullable: true })
  cost_price: number | null;

  @Column({ type: 'numeric', nullable: true })
  selling_price: number | null;

  @Column({ nullable: true })
  tax_category: string | null;

  @Column({ nullable: true })
  currency: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
