export function generateAuthSetup(providers: any[], userFields: any[]): string {
  return `import { ClerkProvider } from '@clerk/nextjs';
import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/api/webhook/clerk"],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// Types
export interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    sessionId: string;
    getToken: () => Promise<string>;
  };
}

// Middleware
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, sessionId, getToken } = req.auth;
    
    if (!userId || !sessionId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// User Model Extensions
${userFields.map((field: any) => `// ${field.name}: ${field.type}`).join('\n')}
`;
}

export function generateAuthWebhook(): string {
  return `import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
 
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }
 
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }
 
  const payload = await req.json();
  const body = JSON.stringify(payload);
 
  const webhook = new Webhook(WEBHOOK_SECRET);
 
  try {
    const evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
 
    const { id, ...attributes } = evt.data;
 
    // Handle user creation/updates
    switch (evt.type) {
      case 'user.created':
        await prisma.user.create({
          data: {
            id: id,
            email: attributes.email_addresses[0]?.email_address,
            name: \`\${attributes.first_name || ''} \${attributes.last_name || ''}\`.trim(),
          },
        });
        break;
      case 'user.updated':
        await prisma.user.update({
          where: { id: id },
          data: {
            email: attributes.email_addresses[0]?.email_address,
            name: \`\${attributes.first_name || ''} \${attributes.last_name || ''}\`.trim(),
          },
        });
        break;
      case 'user.deleted':
        await prisma.user.delete({
          where: { id: id },
        });
        break;
    }
 
    return new Response('Webhook processed successfully', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }
}`;
} 