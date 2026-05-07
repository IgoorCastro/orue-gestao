// backend/src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { User } from "@/generated/prisma/browser";
import { JwtPayload } from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Validar token
    try {
      const decoded = jwtDecode<User & JwtPayload>(token);
      
      // Verificar expiração
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { error: "Token expirado" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
