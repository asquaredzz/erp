import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'warehouses' })
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'jsonb', nullable: true })
  address: any;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
