import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  WORKER = 'warehouse_worker',
  MANAGER = 'manager',
  ADMIN = 'admin',
  DIRECTOR = 'director',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  auth0_id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @Column({ nullable: true })
  phone_number!: string;

  @Column({ default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at!: Date;
}
