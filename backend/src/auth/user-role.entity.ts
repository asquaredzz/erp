import { Entity, Column } from 'typeorm';

@Entity({ name: 'user_roles' })
export class UserRole {
  @Column({ type: 'uuid', primary: true })
  user_id: string;

  @Column({ type: 'uuid', primary: true })
  role_id: string;
}
