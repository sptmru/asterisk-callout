import { AriData } from '../domain/types/aridata.type';
import { Endpoint } from 'ari-client';
import { Extension } from '../domain/entities/extension.entity';
import { dataSource } from '../infrastructure/database/data-source';
import { ExtensionStatusEnum } from '../domain/enums/extensionstatus.enum';

export class ExtensionsService {
  static async getAriEndpoints(ariData: AriData): Promise<Endpoint[]> {
    const { client } = ariData;
    return await client.endpoints.list();
  }

  static async getExtensions(): Promise<Extension[]> {
    return await dataSource.getRepository(Extension).find();
  }

  static async getExtensionsByStatus(status: ExtensionStatusEnum): Promise<Extension[]> {
    return await dataSource
      .getRepository(Extension)
      .createQueryBuilder('extension')
      .innerJoinAndSelect('extension.data', 'extensionStatus')
      .where('extensionStatus.state = :status', { status })
      .getMany();
  }
}
