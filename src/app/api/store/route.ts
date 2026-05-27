// API responsavel por tratar lojas
// Permite o usuario criar e manipular dados de lojas
// Rota POST -> cria um novo registro de loja no db
// Rota GET -> retorna uma lista de loja

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { CreateStoreUseCase } from "@/src/application/store/use-case/store-create.usecase";
import { PrismaStoreRepository } from "@/src/infrastructure/database/repositories/prisma-store.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { FindStoresUseCase } from "@/src/application/store/use-case/store-find.usecase";
import { z } from "zod";
import { CreateStoreSchema } from "@/src/lib/schemas/store.schema";
import { getAuthToken } from "@/src/infrastructure/services/jwt-service";
import { UserRole } from "@/src/domain/enums/user-role.enum";

// Rota POST
// body esperado: name
export async function POST(req: NextRequest) {
    try {
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const body = await req.json();

        // Validar entrada com Zod
        const { name } = CreateStoreSchema.parse(body);

        function makeCreateUseCase() {
            const storeRepository = new PrismaStoreRepository(prisma);
            const uuid = new UUIDGenerator();
            return new CreateStoreUseCase(storeRepository, uuid)
        }

        const createUseCase = makeCreateUseCase();

        const store = await createUseCase.execute({ name });

        return NextResponse.json(store, { status: 200 });
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

// Rota GET
// retorna uma lista com todas as lojas registradas
// aceita tbm filtros como params
export async function GET(req: NextRequest) {
    try{
        const auth = await getAuthToken(req);
        if (!auth.valid) return auth.error;

        // Rota protegida - ADMIN ONLY
        if (auth.decoded.role !== UserRole.ADMIN)
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        
        const { searchParams } = new URL(req.url);

        const name = searchParams.get("name") ?? undefined;
        
        // filtragem com ou sem items deletados
        const onlyDeleted = searchParams.get("onlyDeleted") ?? undefined;
        const withDeleted = searchParams.get("withDeleted") ?? undefined;

        const findUseCase = new FindStoresUseCase(new PrismaStoreRepository(prisma));

        const stores = await findUseCase.execute({
            name,
            withDeleted: !!withDeleted,
            onlyDeleted: !!onlyDeleted,
        })

        return NextResponse.json(stores, { status: 200 });
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
