import { z } from 'zod';

export const CreateStoreSchema = z.object({
  name: z.string().min(2).max(100).trim(),
});

export const UpdateStoreSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateStoreInput = z.infer<typeof CreateStoreSchema>;
export type UpdateStoreInput = z.infer<typeof UpdateStoreSchema>;
