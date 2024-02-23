import { SipDriverEnum } from '../enums/sipdriver.enum';

export const ExtensionDefinition = {
  $id: 'Extension',
  type: 'object',
  required: ['sipDriver', 'extensionNumber'],
  properties: {
    id: { type: 'string' },
    sipDriver: { type: 'string', enum: Object.values(SipDriverEnum) },
    extensionNumber: { type: 'string' },
    data: { $ref: 'ExtensionStatus#' },
  },
};
