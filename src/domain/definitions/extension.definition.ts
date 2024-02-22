export const ExtensionDefinition = {
  $id: 'Extension',
  type: 'object',
  required: ['sip_driver', 'extension_number'],
  properties: {
    id: { type: 'string' },
    sip_driver: { type: 'string' },
    extension_number: { type: 'string' }
  }
};
