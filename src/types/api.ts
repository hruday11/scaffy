// Dynamic database types
export interface DatabaseField {
  name: string;
  type: string;
  constraints: string[];
}

export interface TableRelationship {
  table: string;
  type: 'one_to_many' | 'many_to_one' | 'many_to_many';
}

export interface DatabaseTable {
  name: string;
  fields: DatabaseField[];
  relationships: TableRelationship[];
}

// API types
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  authentication: boolean;
  requestBody: Record<string, any> | null;
  responseSchema: Record<string, any>;
}

// Auth types
export interface AuthProvider {
  name: string;
  type: 'oauth' | 'email' | 'social';
  config: Record<string, any>;
}

// Payment types
export interface PaymentProduct {
  name: string;
  type: 'one_time' | 'subscription';
  priceDescription: string;
  features: string[];
}

// Main structure
export interface BackendStructure {
  database: {
    tables: DatabaseTable[];
  };
  api: {
    endpoints: ApiEndpoint[];
  };
  auth: {
    providers: AuthProvider[];
    userFields: DatabaseField[];
  };
  payments: {
    products: PaymentProduct[];
  };
}

// API Request/Response types
export interface DynamicRequest {
  [key: string]: any;
}

export interface DynamicResponse {
  data?: any;
  error?: string;
}

// Generation response
export interface GenerateApiResponse {
  structure: BackendStructure;
  error?: string;
}

// File generation
export interface FileContent {
  path: string;
  content: string;
} 