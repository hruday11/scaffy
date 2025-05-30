import type { BackendStructure } from '@/types/api';

const MOCK_SAAS_TEMPLATE: BackendStructure = {
  database: {
    tables: [
      {
        name: 'User',
        fields: [
          { name: 'id', type: 'String', constraints: ['@id', '@default(cuid())'] },
          { name: 'email', type: 'String', constraints: ['@unique'] },
          { name: 'name', type: 'String', constraints: [] },
          { name: 'createdAt', type: 'DateTime', constraints: ['@default(now())'] },
        ],
        relationships: []
      },
      {
        name: 'Client',
        fields: [
          { name: 'id', type: 'String', constraints: ['@id', '@default(cuid())'] },
          { name: 'name', type: 'String', constraints: [] },
          { name: 'email', type: 'String', constraints: [] },
          { name: 'phone', type: 'String', constraints: ['?'] },
          { name: 'createdAt', type: 'DateTime', constraints: ['@default(now())'] },
        ],
        relationships: [
          { table: 'User', type: 'many_to_one' }
        ]
      },
      {
        name: 'Invoice',
        fields: [
          { name: 'id', type: 'String', constraints: ['@id', '@default(cuid())'] },
          { name: 'amount', type: 'Decimal', constraints: [] },
          { name: 'status', type: 'String', constraints: ['@default("draft")'] },
          { name: 'dueDate', type: 'DateTime', constraints: [] },
          { name: 'createdAt', type: 'DateTime', constraints: ['@default(now())'] },
        ],
        relationships: [
          { table: 'Client', type: 'many_to_one' },
          { table: 'User', type: 'many_to_one' }
        ]
      }
    ]
  },
  api: {
    endpoints: [
      {
        path: '/api/clients',
        method: 'GET',
        description: 'Get all clients for the authenticated user',
        authentication: true,
        requestBody: null,
        responseSchema: { type: 'array', items: { type: 'object', properties: { id: 'string' } } }
      },
      {
        path: '/api/clients',
        method: 'POST',
        description: 'Create a new client',
        authentication: true,
        requestBody: {
          name: 'string',
          email: 'string',
          phone: 'string?'
        },
        responseSchema: { type: 'object', properties: { id: 'string' } }
      },
      {
        path: '/api/invoices',
        method: 'GET',
        description: 'Get all invoices',
        authentication: true,
        requestBody: null,
        responseSchema: { type: 'array', items: { type: 'object', properties: { id: 'string' } } }
      },
      {
        path: '/api/invoices',
        method: 'POST',
        description: 'Create a new invoice',
        authentication: true,
        requestBody: {
          clientId: 'string',
          amount: 'number',
          dueDate: 'string'
        },
        responseSchema: { type: 'object', properties: { id: 'string' } }
      }
    ]
  },
  auth: {
    providers: [
      { name: 'email', type: 'email', config: {} },
      { name: 'google', type: 'oauth', config: {} }
    ],
    userFields: [
      { name: 'email', type: 'string', constraints: [] },
      { name: 'name', type: 'string', constraints: [] },
      { name: 'avatar', type: 'string', constraints: ['?'] }
    ]
  },
  payments: {
    products: [
      {
        name: 'Basic Plan',
        type: 'subscription',
        priceDescription: '$10/month - Up to 10 clients',
        features: ['Up to 10 clients']
      },
      {
        name: 'Pro Plan',
        type: 'subscription',
        priceDescription: '$25/month - Unlimited clients',
        features: ['Unlimited clients']
      }
    ]
  }
};

export function mockGenerateStructure(prompt: string): BackendStructure {
  // For now, return the same template regardless of the prompt
  // In a more advanced version, we could have multiple templates and some basic
  // keyword matching to return different structures based on the prompt
  return MOCK_SAAS_TEMPLATE;
} 