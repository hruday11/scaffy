import { Webhook } from 'svix';
import prisma from '@/lib/db';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  console.log('Webhook received');
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET');
    return new Response('Missing secret', { status: 400 });
  }

  const payload = await req.json();
  console.log('Webhook payload:', JSON.stringify(payload, null, 2));
  
  const headers = req.headers;
  const svix_id = headers.get('svix-id');
  const svix_timestamp = headers.get('svix-timestamp');
  const svix_signature = headers.get('svix-signature');
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Missing svix headers', { status: 400 });
  }

  const webhook = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;
  
  try {
    event = webhook.verify(JSON.stringify(payload), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('Webhook verified successfully');
  } catch (err) {
    console.error('Invalid signature:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  console.log('Webhook event type:', event.type);

  // Handle user.created event
  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = event.data;
    console.log('Creating user:', { id, email: email_addresses[0]?.email_address });
    
    try {
      const user = await prisma.user.upsert({
        where: { id },
        update: {},
        create: {
          id,
          email: email_addresses[0]?.email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
        },
      });
      console.log('User created successfully:', user);
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('OK', { status: 200 });
} 