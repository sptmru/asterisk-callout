import { ExtensionStatusEnum } from '../enums/extensionstatus.enum';

export const ExtensionStatusDefinition = {
  $id: 'ExtensionStatus',
  type: 'object',
  required: ['state'],
  properties: {
    id: { type: 'string' },
    state: { type: 'string', enum: Object.values(ExtensionStatusEnum) }
  }
};
