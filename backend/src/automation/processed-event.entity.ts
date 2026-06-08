import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'processed_events' })
export class ProcessedEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  event_hash: string;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @CreateDateColumn()
  created_at: Date;
}
