import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderStatus } from '../../common/enums/provider-status.enum';
import { ProviderType } from '../../common/enums/provider-type.enum';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ProviderType,
  })
  type: ProviderType;

  @Column({ name: 'business_name', length: 150 })
  businessName: string;

  @Column({ unique: true, length: 13 })
  rfc: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.ACTIVE,
  })
  status: ProviderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}