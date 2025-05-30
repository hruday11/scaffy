import type { ApiEndpoint, DatabaseTable } from '@/types/api';

function generateRouteHandler(endpoint: ApiEndpoint, table: DatabaseTable): string {
  const handlerName = endpoint.path.split('/').filter(Boolean).join('_');
  
  const authMiddleware = endpoint.authentication ? 
    'requireAuth, ' : 
    '';

  const validationSchema = endpoint.requestBody ? `
const ${handlerName}Schema = z.object(${JSON.stringify(endpoint.requestBody, null, 2)});` : '';

  switch (endpoint.method) {
    case 'GET':
      return `
export const ${handlerName} = async (${endpoint.authentication ? 'req: AuthenticatedRequest' : 'req: Request'}, res: Response) => {
  try {
    const items = await prisma.${table.name.toLowerCase()}.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};`;

    case 'POST':
      return `
${validationSchema}

export const ${handlerName} = async (${endpoint.authentication ? 'req: AuthenticatedRequest' : 'req: Request'}, res: Response) => {
  try {
    const data = ${handlerName}Schema.parse(req.body);
    const item = await prisma.${table.name.toLowerCase()}.create({
      data
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};`;

    case 'PUT':
      return `
${validationSchema}

export const ${handlerName} = async (${endpoint.authentication ? 'req: AuthenticatedRequest' : 'req: Request'}, res: Response) => {
  try {
    const { id } = req.params;
    const data = ${handlerName}Schema.parse(req.body);
    
    const item = await prisma.${table.name.toLowerCase()}.update({
      where: { id },
      data
    });
    
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};`;

    case 'DELETE':
      return `
export const ${handlerName} = async (${endpoint.authentication ? 'req: AuthenticatedRequest' : 'req: Request'}, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.${table.name.toLowerCase()}.delete({
      where: { id }
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};`;

    default:
      return '';
  }
}

export function generateRouteFile(endpoint: ApiEndpoint, table: DatabaseTable): string {
  return `import { ${endpoint.authentication ? 'AuthenticatedRequest' : 'Request'}, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
${endpoint.authentication ? "import { requireAuth } from '@/middleware/auth';" : ''}

${generateRouteHandler(endpoint, table)}

export default {
  path: '${endpoint.path}',
  method: '${endpoint.method.toLowerCase()}',
  handler: [${endpoint.authentication ? 'requireAuth, ' : ''}${endpoint.path.split('/').filter(Boolean).join('_')}]
};`;
}

export function generateRoutesIndex(endpoints: ApiEndpoint[]): string {
  return `import { Router } from 'express';
${endpoints.map((_, i) => `import route${i} from './routes/${_.path.split('/').filter(Boolean).join('_')}';`).join('\n')}

const router = Router();

${endpoints.map((_, i) => `router[route${i}.method](route${i}.path, ...route${i}.handler);`).join('\n')}

export default router;`;
} 