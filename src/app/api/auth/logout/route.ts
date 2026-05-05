// backend/src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 }
    );

    // Remove o cookie de autenticação
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0, // Expirar imediatamente
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}
