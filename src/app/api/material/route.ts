import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { PrismaMaterialRepository } from "@/src/infrastructure/database/repositories/prisma-material.repository";
import { FindMaterialsUseCase } from "@/src/application/meterial/usecase/material-find.usecase";
import { CreateMaterialUseCase } from "@/src/application/meterial/usecase/material-create.usecase";
import { z } from "zod";
import { CreateMaterialSchema } from "@/src/lib/schemas/material.schema";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota para criação de um novo material
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
        const { name } = CreateMaterialSchema.parse(body);

        function makeCreateMaterialUseCase() {
            const materialRepository = new PrismaMaterialRepository(prisma);
            const uuid = new UUIDGenerator();

            return new CreateMaterialUseCase(materialRepository, uuid);
        }   

        const createMaterialUseCase = makeCreateMaterialUseCase();

        const material = await createMaterialUseCase.execute({ name });

        return NextResponse.json(material, { status: 201 });
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
// retorna uma lista de materiais
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

        const materialRepository = new PrismaMaterialRepository(prisma);
        const findMaterialsUseCase = new FindMaterialsUseCase(materialRepository);

        // useCase findMany executando
        const colors = await findMaterialsUseCase.execute({
            name,
            withDeleted: !!withDeleted,
            onlyDeleted: !!onlyDeleted,
        });

        return NextResponse.json(colors, { status: 200 });

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
