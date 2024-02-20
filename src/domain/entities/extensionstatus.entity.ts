import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';

@Entity('extension_status')
export class ExtensionstatusEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: ExtensionStatusEnum, default: ExtensionStatusEnum.AVAILABLE })
  status: string;
}
