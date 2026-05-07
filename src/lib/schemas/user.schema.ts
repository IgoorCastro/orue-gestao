import { z } from 'zod';
import { UserRole } from '@/src/domain/enums/user-role.enum';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  nickname: z.string().min(3).max(50).trim(),
  password: z.string().min(8).max(100),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  nickname: z.string().min(3).max(50).trim().optional(),
  password: z.string().min(8).max(100).optional(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
}).refine(obj => Object.keys(obj).length > 0, 'Pelo menos um campo deve ser fornecido');

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
