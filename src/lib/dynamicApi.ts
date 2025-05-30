import { PrismaClient } from '@prisma/client';
import { DynamicRequest, DynamicResponse } from '@/types/api';

const prisma = new PrismaClient();

export async function handleDynamicGet(
  modelName: string,
  userId: string,
  query: Record<string, any> = {}
): Promise<DynamicResponse> {
  try {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) {
      return { error: `Model ${modelName} not found` };
    }

    const data = await model.findMany({
      where: { userId, ...query },
      orderBy: { createdAt: 'desc' },
    });

    return { data };
  } catch (error) {
    console.error(`Error fetching ${modelName}:`, error);
    return { error: `Failed to fetch ${modelName}` };
  }
}

export async function handleDynamicCreate(
  modelName: string,
  userId: string,
  data: DynamicRequest
): Promise<DynamicResponse> {
  try {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) {
      return { error: `Model ${modelName} not found` };
    }

    const result = await model.create({
      data: {
        ...data,
        userId,
      },
    });

    return { data: result };
  } catch (error) {
    console.error(`Error creating ${modelName}:`, error);
    return { error: `Failed to create ${modelName}` };
  }
}

export async function handleDynamicUpdate(
  modelName: string,
  userId: string,
  id: string,
  data: DynamicRequest
): Promise<DynamicResponse> {
  try {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) {
      return { error: `Model ${modelName} not found` };
    }

    // Check ownership
    const existing = await model.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { error: 'Not found or unauthorized' };
    }

    const result = await model.update({
      where: { id },
      data,
    });

    return { data: result };
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error);
    return { error: `Failed to update ${modelName}` };
  }
}

export async function handleDynamicDelete(
  modelName: string,
  userId: string,
  id: string
): Promise<DynamicResponse> {
  try {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) {
      return { error: `Model ${modelName} not found` };
    }

    // Check ownership
    const existing = await model.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { error: 'Not found or unauthorized' };
    }

    await model.delete({
      where: { id },
    });

    return { data: { success: true } };
  } catch (error) {
    console.error(`Error deleting ${modelName}:`, error);
    return { error: `Failed to delete ${modelName}` };
  }
} 