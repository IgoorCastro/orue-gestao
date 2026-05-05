// backend/src/lib/middleware/auth.middleware.ts
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface AuthPayload extends JwtPayload {
  id: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

/**
 * Valida e decodifica um JWT
 * @param token - Token JWT
 * @returns Payload decodificado ou null se inválido
 */
export function validateToken(token: string | undefined): AuthPayload | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<AuthPayload>(token);

    // Verificar expiração
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; // Token expirado
    }

    // Verificar campos obrigatórios
    if (!decoded.id || !decoded.role || !decoded.name) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null; // Token inválido
  }
}

/**
 * Valida se o usuário tem a role necessária
 * @param userRole - Role do usuário
 * @param requiredRoles - Array de roles permitidas
 * @returns true se o usuário tem uma das roles
 */
export function hasRole(
  userRole: string | undefined,
  requiredRoles: string[]
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}
