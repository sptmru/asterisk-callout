import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SipDriverEnum } from '../enums/sipdriver.enum';
import { ExtensionStatus } from './extensionstatus.entity';
import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';
import { dataSource } from '../../infrastructure/database/data-source';

@Entity('extension')
export class Extension {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'sip_driver', type: 'enum', enum: SipDriverEnum, default: SipDriverEnum.PJSIP })
  sipDriver: string;

  @Index(['extension_number'], { unique: true })
  @Column('varchar', { name: 'extension_number', length: 10, nullable: false })
  extensionNumber: string;

  @OneToOne(() => ExtensionStatus, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  data: ExtensionStatus;

  @BeforeInsert()
  async createExtensionStatus(): Promise<void> {
    let status = new ExtensionStatus();
    status.state = ExtensionStatusEnum.UNAVAILABLE;

    status = await dataSource.manager.save(status);
    this.data = status;
  }
}
