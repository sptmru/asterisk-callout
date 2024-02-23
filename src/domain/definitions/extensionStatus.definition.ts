import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';

export const ExtensionStatusDefinition = {
  $id: 'ExtensionStatus',
  type: 'object',
  required: ['state'],
  properties: {
    state: { type: 'string', enum: Object.values(ExtensionStatusEnum) }
  }
};
