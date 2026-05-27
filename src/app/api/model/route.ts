import { DomainError } from "@/src/domain/errors/domain.error";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { PrismaModelRepository } from "@/src/infrastructure/database/repositories/prisma-model.repository";
import { CreateModelUseCase } from "@/src/application/model/usecase/model-create.usecase";
import { FindModelsUseCase } from "@/src/application/model/usecase/model-find.usecase";
import { z } from "zod";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { CreateModelSchema } from "@/src/lib/schemas/model.schema";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota para criação de um novo modelo
export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded?.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );

        const body = await req.json();

        // Validar entrada com Zod (usando schema de cor como modelo simples)
        const { name } = CreateModelSchema.parse(body);

        function makeCreateModelUseCase() {
            const modelepository = new PrismaModelRepository(prisma);
            const uuid = new UUIDGenerator();

            return new CreateModelUseCase(modelepository, uuid);
        }   

        const createModelUseCase = makeCreateModelUseCase();

        const model = await createModelUseCase.execute({ name });

        return NextResponse.json(model, { status: 201 });
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
// retorna uma lista de modelos
export async function GET(req: NextRequest) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
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

        const modelRepository = new PrismaModelRepository(prisma);
        const findModelsUseCase = new FindModelsUseCase(modelRepository);

        // useCase findMany executando
        const colors = await findModelsUseCase.execute({
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
