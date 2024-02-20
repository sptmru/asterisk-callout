import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExtensionStatusEnum } from '../types/enums/ExtensionStatus';

@Entity('extension_status')
export class ExtensionStatus {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: ExtensionStatusEnum, default: ExtensionStatusEnum.AVAILABLE })
  status: string;
}
