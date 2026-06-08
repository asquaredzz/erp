import { Entity, Column } from 'typeorm';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @Column({ type: 'uuid', primary: true })
  role_id: string;

  @Column({ type: 'uuid', primary: true })
  permission_id: string;
}
