import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SipDriverEnum } from '../enums/sipdriver.enum';
import { ExtensionStatus } from './extensionstatus.entity';
import { logger } from '../../misc/Logger';
import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';
import { dataSource } from '../../infrastructure/database/data-source';

@Entity('extension')
export class Extension {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: SipDriverEnum, default: SipDriverEnum.PJSIP })
  sip_driver: string;

  @Column('varchar', { length: 10, nullable: false })
  extension_number: string;

  @OneToOne(() => ExtensionStatus, { cascade: true })
  @JoinColumn()
  data: ExtensionStatus;

  @BeforeInsert()
  async createExtensionStatus() {
    let status = new ExtensionStatus();
    status.state = ExtensionStatusEnum.BUSY;

    status = await dataSource.manager.save(status);
    this.data = status;
  }
}
