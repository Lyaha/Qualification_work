import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 100, nullable: true })
  contact_person!: string;

  @Column({ length: 20, nullable: true })
  phone!: string;

  @Column({ length: 255, nullable: true })
  email!: string;
}
