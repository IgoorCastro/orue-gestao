// backend/src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { BcryptService } from "@/src/infrastructure/services/bcrypt.service";
import { PrismaUserRepository } from "@/src/infrastructure/database/repositories/prisma-user.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { LoginUseCase } from "@/src/application/login/use-case/login-use-case";

export async function POST(request: Request) {
  try {
    const { nickname, password } = await request.json();
  console.log("nickname: ", nickname)
  console.log("password: ", password)

    // injeção de Dependência
    const userRepository = new PrismaUserRepository(prisma);
    const hashService = new BcryptService();

    // instancia o Use Case
    const loginUseCase = new LoginUseCase(userRepository, hashService);

    // executa a lógica de domínio
    const session = await loginUseCase.execute({ nickname, password });

    if (!session) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Retorna o DTO do usuário para o solicitante
    return NextResponse.json({
      user: session.user,
      token: session.token,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}