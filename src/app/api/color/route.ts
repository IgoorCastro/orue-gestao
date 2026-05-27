import { CreateColorUseCase } from "@/src/application/color/usecase/color-create.usecase";
import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaColorRepository } from "@/src/infrastructure/database/repositories/prisma-color.repository";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { FindColorsUseCase } from "@/src/application/color/usecase/color-find.usecase";
import { z } from "zod";
import { CreateColorSchema } from "@/src/lib/schemas/color.schema";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota para criação de uma nova cor
export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        
        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        
        const body = await req.json();

    // Validar entrada com Zod
        const { name } = CreateColorSchema.parse(body);

        function makeCreateColorUseCase() {
            const colorRepository = new PrismaColorRepository(prisma);
            const uuid = new UUIDGenerator();

            return new CreateColorUseCase(colorRepository, uuid);
        }   

        const createColorUseCase = makeCreateColorUseCase();

        const color = await createColorUseCase.execute({ name });

        return NextResponse.json(color, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Dados inválidos", details: error.issues },
                { status: 400 }
            );
        }
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }
        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}

// get all e byName
// retorna uma lista de usuarios
export async function GET(req: NextRequest) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;
        
        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
            
        const { searchParams } = new URL(req.url);

        const name = searchParams.get("name") ?? undefined;

        // filtragem com ou sem items deletados
        const onlyDeleted = searchParams.get("onlyDeleted") ?? undefined;
        const withDeleted = searchParams.get("withDeleted") ?? undefined;

        const colorRepository = new PrismaColorRepository(prisma);
        const findManyUseCase = new FindColorsUseCase(colorRepository);

        // useCase findMany executando
        const users = await findManyUseCase.execute({
            name,
            withDeleted: !!withDeleted,
            onlyDeleted: !!onlyDeleted,
        });

        return NextResponse.json(users, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof DomainError) {
            return NextResponse.json(
                { message: error.message },
                { status: mapDomainErrorToStatus(error) }
            );
        }

        return NextResponse.json(
            { message: "Erro interno" },
            { status: 500 }
        );
    }
}
