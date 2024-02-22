import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';

@Entity('extension_status')
export class ExtensionStatus {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: ExtensionStatusEnum, default: ExtensionStatusEnum.UNAVAILABLE })
  state: string;
}
