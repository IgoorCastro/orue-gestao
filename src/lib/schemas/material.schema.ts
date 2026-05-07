import { z } from 'zod';

export const CreateMaterialSchema = z.object({
  name: z.string().min(2).max(100).trim(),
});

export const UpdateMaterialSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateMaterialInput = z.infer<typeof CreateMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof UpdateMaterialSchema>;
