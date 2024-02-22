import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SipDriverEnum } from '../enums/sipdriver.enum';
import { ExtensionStatus } from './extensionstatus.entity';

@Entity('extension')
export class Extension {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: SipDriverEnum, default: SipDriverEnum.PJSIP })
  sip_driver: string;

  @Column('varchar', { length: 10, nullable: false })
  extension_number: string;

  @OneToOne(() => ExtensionStatus)
  @JoinColumn()
  data: ExtensionStatus;
}
