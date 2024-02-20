import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SipDriver } from '../types/enums/SipDriver';

@Entity('extension')
export class Extension {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: SipDriver, default: SipDriver.PJSIP })
  sip_driver: string;

  @Column('varchar', { length: 10, nullable: false })
  extension_number: string;
}
