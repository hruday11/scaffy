import type { BackendStructure, FileContent } from '@/types/api';
import { generatePrismaSchema, generateMigrationScript } from './templates/database';
import { generateRouteFile, generateRoutesIndex } from './templates/api';
import { generateAuthSetup, generateAuthWebhook } from './templates/auth';
import { generateStripeSetup, generateStripeWebhook, generateStripeConfig } from './templates/stripe';
// Remove stripe imports since the file doesn't exist yet

export async function generateProjectFiles(structure: BackendStructure): Promise<FileContent[]> {
  const files: FileContent[] = [];

  // Generate database files
  files.push({
    path: 'prisma/schema.prisma',
    content: generatePrismaSchema(structure),
  });

  files.push({
    path: 'prisma/migrations/initial/migration.sql',
    content: generateMigrationScript(structure),
  });

  // Generate API routes
  structure.api.endpoints.forEach((endpoint, index) => {
    const relatedTable = structure.database.tables.find(
      table => endpoint.path.toLowerCase().includes(table.name.toLowerCase())
    );

    if (relatedTable) {
      files.push({
        path: `src/routes/${endpoint.path.split('/').filter(Boolean).join('_')}.ts`,
        content: generateRouteFile(endpoint, relatedTable),
      });
    }
  });

  files.push({
    path: 'src/routes/index.ts',
    content: generateRoutesIndex(structure.api.endpoints),
  });

  // Generate authentication files
  files.push({
    path: 'src/middleware/auth.ts',
    content: generateAuthSetup(structure.auth.providers, structure.auth.userFields),
  });

  files.push({
    path: 'src/app/api/webhook/clerk/route.ts',
    content: generateAuthWebhook(),
  });

  // Generate Stripe integration files
  files.push({
    path: 'src/lib/stripe.ts',
    content: generateStripeSetup(structure.payments.products),
  });

  files.push({
    path: 'src/app/api/webhook/stripe/route.ts',
    content: generateStripeWebhook(),
  });

  files.push({
    path: 'src/config/stripe.ts',
    content: generateStripeConfig(structure.payments.products),
  });

  // Generate package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: 'generated-backend',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        'db:push': 'prisma db push',
        'db:studio': 'prisma studio',
      },
      dependencies: {
        '@clerk/nextjs': '^4.0.0',
        '@prisma/client': '^5.0.0',
        '@stripe/stripe-js': '^2.0.0',
        'next': '^14.0.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'stripe': '^14.0.0',
        'svix': '^1.0.0',
        'zod': '^3.0.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        'prisma': '^5.0.0',
        'typescript': '^5.0.0',
      },
    }, null, 2),
  });

  // Generate README.md
  files.push({
    path: 'README.md',
    content: `# Generated Backend

This is a generated backend project with the following features:
- Database: SQLite with Prisma ORM
- Authentication: Clerk
- Payments: Stripe
- API: REST endpoints with Express-like routing
- TypeScript support

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
\`\`\`

3. Initialize the database:
\`\`\`bash
npm run db:push
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## API Routes

${structure.api.endpoints.map(endpoint => `
### ${endpoint.path}
- Method: ${endpoint.method}
- Auth Required: ${endpoint.authentication}
- Description: ${endpoint.description}
`).join('\n')}

## Database Schema

${structure.database.tables.map(table => `
### ${table.name}
${table.fields.map(field => `- ${field.name}: ${field.type}`).join('\n')}
`).join('\n')}
`,
  });

  // Generate .env.example
  files.push({
    path: '.env.example',
    content: `DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
`,
  });

  return files;
} 