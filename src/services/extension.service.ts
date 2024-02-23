import { AriData } from '../domain/types/aridata.type';
import { Endpoint } from 'ari-client';
import { Extension } from '../domain/entities/extension.entity';
import { dataSource } from '../infrastructure/database/data-source';
import { ExtensionStatusEnum } from '../domain/enums/extensionstatus.enum';
import { CreateExtensionBody } from '../domain/types/extensions/createExtensionBody.type';

export class ExtensionService {
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

  static async getExtensionByNumber(extensionNumber: string): Promise<Extension | null> {
    return await dataSource.getRepository(Extension).findOne({ where: { extensionNumber } });
  }

  static async createExtension(extensionData: CreateExtensionBody): Promise<Extension> {
    let extension = new Extension();
    extension.sipDriver = extensionData.sipDriver;
    extension.extensionNumber = extensionData.extensionNumber;

    extension = await dataSource.manager.save(extension);
    return extension;
  }

  static async deleteExtension(extension: Extension): Promise<void> {
    await dataSource.manager.remove(extension);
    await dataSource.manager.remove(extension.data);
    return;
  }
}
