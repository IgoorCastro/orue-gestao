import { hasRoutePermission, ROUTE_PERMISSIONS } from "@/src/domain/auth/permissions";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
}

export function authGuard(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // 1. EXCEÇÕES: Não aplicar segurança para APIs, arquivos internos ou assets
  // Isso garante que o fetch('/api/auth/login') chegue no arquivo route.ts
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // arquivos como favicon.ico, logo.png
    pathname === '/login'
  ) {
    // Se estiver logado e tentar ir para /login via URL, manda para a home
    if (pathname === '/login' && token) {
      try{
        validateToken(token);
        return NextResponse.redirect(new URL('/', request.url));
      }catch { }
    }
    return NextResponse.next();
  }

  // PROTEÇÃO GLOBAL: Qualquer rota (que não caiu na exceção acima) exige token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let decoded: DecodedToken;

  try {
    decoded = validateToken(token);
  } catch {
    // token inválido, expirado ou adulterado
    const response = NextResponse.redirect(new URL("/login", request.url));
    // apaga o token da sessão
    response.cookies.delete("auth-token");

    return response;
  }

  // VALIDAÇÃO DE PERMISSÕES POR ROLE
  const isProtectedRoute = ROUTE_PERMISSIONS.some(route => pathname.startsWith(route.path));

  if (isProtectedRoute) {
    if (!hasRoutePermission(decoded.role, pathname)) {
      // Redireciona para a página base da role dele (ex: /admin ou /operator)
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// checagem de autenticação
export async function getAuthToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // verifica a existencia do token
  if (!token) {
    return {
      valid: false, error: NextResponse.json(
        { error: "Unauthorized" }, { status: 401 }
      )
    }
  }

  // validando o token
  try {
    const decoded = validateToken(token);

    return { valid: true, decoded };
  } catch (error) {
    return {
      valid: false,
      error: NextResponse.json(
        {
          error:
            error instanceof jwt.TokenExpiredError
              ? "Token expired"
              : "Invalid token"
        },
        { status: 401 }
      )
    };
  }
}

// valida o token e verifica a assinatura
function validateToken(token: string) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as DecodedToken;
}
