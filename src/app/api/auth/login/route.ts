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
    // 1️⃣ Rate limit PRIMEIRO (economiza processamento)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 5, 15 * 60 * 1000);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${rateLimit.resetAfter}s` },
        { status: 429 }
      );
    }

    // 2️⃣ Parse JSON
    const body = await request.json();

    // 3️⃣ Validar entrada
    const { nickname, password } = LoginSchema.parse(body);

    // 4️⃣ Injeção de Dependência
    const userRepository = new PrismaUserRepository(prisma);
    const hashService = new BcryptService();
    const loginUseCase = new LoginUseCase(userRepository, hashService);

    // 5️⃣ Executar autenticação
    const session = await loginUseCase.execute({ nickname, password });

    if (!session) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 6️⃣ Criar resposta com cookie HttpOnly
    const response = NextResponse.json({
      user: session.user,
      token: session.token,
    });

    response.cookies.set('auth-token', session.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60,
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

    console.error("Login error:", error); // ✅ Sem credenciais
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}