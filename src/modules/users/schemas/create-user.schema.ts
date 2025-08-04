import { z } from 'zod';
import { UserRole } from 'src/utils/enums/user-type.enum'; // Certifique-se de que UserRole está definido

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER), // Usa z.nativeEnum para enums TypeScript

  // Campos opcionais para perfil de fotógrafo
  location: z.string().optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(), // Array de strings
  rating: z.number().optional(),
  reviewCount: z.number().int().optional(), // Inteiro para contagem
  portfolioCount: z.number().int().optional(), // Inteiro para contagem
  profileImage: z.string().url('URL de imagem de perfil inválida.').optional(),
});

export type TCreateUser = z.infer<typeof createUserSchema>;
