import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SipDriverEnum } from '../enums/sipdriver.enum';
import { ExtensionStatus } from './extensionstatus.entity';
import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';
import { dataSource } from '../../infrastructure/database/data-source';

@Entity('extension')
export class Extension {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'enum', enum: SipDriverEnum, default: SipDriverEnum.PJSIP })
  sip_driver: string;

  @Index(['extension_number'], { unique: true })
  @Column('varchar', { length: 10, nullable: false })
  extension_number: string;

  @OneToOne(() => ExtensionStatus, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  data: ExtensionStatus;

  @BeforeInsert()
  async createExtensionStatus() {
    let status = new ExtensionStatus();
    status.state = ExtensionStatusEnum.UNAVAILABLE;

    status = await dataSource.manager.save(status);
    this.data = status;
  }
}
