// backend/src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { BcryptService } from "@/src/infrastructure/services/bcrypt.service";
import { PrismaUserRepository } from "@/src/infrastructure/database/repositories/prisma-user.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { LoginUseCase } from "@/src/application/login/use-case/login-use-case";
import { checkRateLimit } from "@/src/lib/ratelimit";
import { z } from "zod";

// Validação de entrada
const LoginSchema = z.object({
  nickname: z.string().min(3).max(50).trim(),
  password: z.string().min(3).max(100),
});

export async function POST(request: Request) {
  try {
    // Rate limit PRIMEIRO (economiza processamento)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 5, 15 * 60 * 1000);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${rateLimit.resetAfter}s` },
        { status: 429 }
      );
    }

    // Parse JSON
    const body = await request.json();

    // Validar entrada
    const { nickname, password } = LoginSchema.parse(body);

    // Injeção de Dependência
    const userRepository = new PrismaUserRepository(prisma);
    const hashService = new BcryptService();
    const loginUseCase = new LoginUseCase(userRepository, hashService);

    // Executar autenticação
    const session = await loginUseCase.execute({ nickname, password });

    if (!session) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Criar resposta com cookie HttpOnly
    const response = NextResponse.json({
      user: session.user,
      token: session.token,
    });

    const sessionTime = 12; // horas
    response.cookies.set('auth-token', session.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: sessionTime * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Login error:", error); // Sem credenciais
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}