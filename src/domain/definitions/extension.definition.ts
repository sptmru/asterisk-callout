import { SipDriverEnum } from '../enums/sipdriver.enum';

export const ExtensionDefinition = {
  $id: 'Extension',
  type: 'object',
  required: ['sip_driver', 'extension_number'],
  properties: {
    id: { type: 'string' },
    sip_driver: { type: 'string', enum: Object.values(SipDriverEnum) },
    extension_number: { type: 'string' },
    data: { $ref: 'ExtensionStatus#' },
  },
};
