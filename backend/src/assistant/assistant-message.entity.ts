import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'assistant_messages' })
export class AssistantMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text', nullable: true })
  reply: string | null;

  @Column({ nullable: true })
  model: string | null;

  @Column({ type: 'float', nullable: true })
  temperature: number | null;

  @CreateDateColumn()
  created_at: Date;
}
