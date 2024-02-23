import { RouteOptionsWithoutHandler } from '../../infrastructure/api/types/RouteOptionsWithoutHandler';
import { ExtensionStatusEnum } from '../../domain/enums/extensionstatus.enum';
import { SipDriverEnum } from '../../domain/enums/sipdriver.enum';

const baseUrl = '/api/v1/extensions';

export const getAllExtensions: RouteOptionsWithoutHandler = {
  method: 'GET',
  url: `${baseUrl}`,
  schema: {
    description: 'Gets all extensions from the DB',
    summary: 'Get all extensions',
    tags: ['extensions'],
    response: {
      200: {
        description: 'Successful response',
        type: 'array',
        items: { $ref: 'Extension#' },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const getExtension: RouteOptionsWithoutHandler = {
  method: 'GET',
  url: `${baseUrl}/:extension_number`,
  schema: {
    description: 'Gets an extension by extension_number from the DB',
    summary: 'Get one extension',
    tags: ['extensions'],
    response: {
      200: { $ref: 'Extension#' },
      404: {
        description: 'Extension not found',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const getExtensionsByStatusOptions: RouteOptionsWithoutHandler = {
  method: 'GET',
  url: `${baseUrl}/filter/:status`,
  schema: {
    description: 'Accepts a status in the URL and looks for extensions with this status in the DB',
    summary: 'Get extensions with given status',
    tags: ['extensions'],
    params: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(ExtensionStatusEnum) },
      },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'array',
        items: { $ref: 'Extension#' },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const createExtensionOptions: RouteOptionsWithoutHandler = {
  method: 'POST',
  url: `${baseUrl}`,
  schema: {
    description: 'Accepts sip_driver (PJSIP/SIP) with an extension number and returns created extension',
    summary: 'Create extension',
    tags: ['extensions'],
    body: {
      type: 'object',
      required: ['sip_driver', 'extension_number'],
      properties: {
        sip_driver: { type: 'string', enum: Object.values(SipDriverEnum) },
        extension_number: { type: 'string' },
      },
    },
    response: {
      201: { $ref: 'Extension#' },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const updateExtensionOptions: RouteOptionsWithoutHandler = {
  method: 'PUT',
  url: `${baseUrl}/:extension_number`,
  schema: {
    description: 'Accepts sip_driver (PJSIP/SIP) with an extension number and returns updated extension',
    summary: 'Update extension',
    tags: ['extensions'],
    body: {
      type: 'object',
      required: [],
      properties: {
        sip_driver: { type: 'string', enum: Object.values(SipDriverEnum) },
        extension_number: { type: 'string' },
      },
    },
    params: {
      type: 'object',
      properties: {
        extension_number: { type: 'string' },
      },
    },
    response: {
      200: { $ref: 'Extension#' },
      404: {
        description: 'Extension not found',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const deleteExtensionOptions: RouteOptionsWithoutHandler = {
  method: 'DELETE',
  url: `${baseUrl}/:extension_number`,
  schema: {
    description: 'Delete extension by extension number',
    summary: 'Delete extension',
    tags: ['extensions'],
    params: {
      type: 'object',
      properties: {
        extension_number: { type: 'string' },
      },
    },
    response: {
      204: {
        description: 'Extension successfully deleted',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        description: 'Extension not found',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const updateExtensionStatusOptions: RouteOptionsWithoutHandler = {
  method: 'PUT',
  url: `${baseUrl}/:extension_number/status`,
  schema: {
    description: 'Accepts extension status and returns updated extension',
    summary: 'Update extension status',
    tags: ['extensions'],
    body: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: Object.values(ExtensionStatusEnum) },
      },
    },
    params: {
      type: 'object',
      properties: {
        extension_number: { type: 'string' },
      },
    },
    response: {
      200: { $ref: 'Extension#' },
      404: {
        description: 'Extension not found',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};
