import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'bins' })
export class Bin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  warehouse_id: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  description: string | null;
}
