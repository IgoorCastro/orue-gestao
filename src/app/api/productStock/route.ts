// API responsavel por tratar a relação de produto em estoque
// Permite o usuario relacionar produtos com estoque
// Rota POST -> cria uma nova relação entre um produto e um estoque
// Rota GET -> retorna uma lista de produtos no estoque de acordo com um filtros enviados via body

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextRequest, NextResponse } from "next/server";
import mapDomainErrorToStatus from "../mapDomainErrorToStatus.error";
import { CreateProductStockUseCase } from "@/src/application/product-stock/usecase/product-stock-create.usecase";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { PrismaProductStockRepository } from "@/src/infrastructure/database/repositories/prisma-product-stock.repository";
import { PrismaStockRepository } from "@/src/infrastructure/database/repositories/prisma-stock.repository";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";
import { PrismaProductRepository } from "@/src/infrastructure/database/repositories/prisma-product.repository";
import { FindProductStocksUseCase } from "@/src/application/product-stock/usecase/product-stock-find.usecase";
import { ProductStockFilterMapper } from "@/src/application/mappers/product-stock-filter.mapper";

// Rota POST
// body esperado: productId, stockId e quantity
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        function makeCreatePsUseCase() {
            const productStockRepository = new PrismaProductStockRepository(prisma);
            const productRepository = new PrismaProductRepository(prisma);
            const stockRepository = new PrismaStockRepository(prisma);
            const uuid = new UUIDGenerator();

            return new CreateProductStockUseCase(productStockRepository, productRepository, stockRepository, uuid);
        }

        const createUseCase = makeCreatePsUseCase();
        const ps = await createUseCase.execute({
            ...body,
        })

        return NextResponse.json(ps, { status: 200 });
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

// Rota GET
// Get com params via URL
// usar para pesquisa com filtros
// filtros: productId e stockId
//
export async function GET(req: NextResponse) {
    try{
        const { searchParams } = new URL(req.url);

        const productId = searchParams.get("productId") ?? undefined;
        const stockId = searchParams.get("stockId") ?? undefined;
        const productName = searchParams.get("productName") ?? undefined; // pesquisa por nome do produto
        
        // paginação e ordem do items
        const limit = searchParams.get("limit") ?? undefined; // limit padrão: 10
        const page = searchParams.get("page") ?? undefined; // page padrão: 1
        const orderBy = searchParams.get("orderBy") ?? undefined;
        
        // filtragem com ou sem items deletados
        const onlyDeleted = searchParams.get("onlyDeleted") ?? undefined;
        const withDeleted = searchParams.get("withDeleted") ?? undefined;

        const findManyUseCase = new FindProductStocksUseCase(new PrismaProductStockRepository(prisma));

        const filterMapper = new ProductStockFilterMapper();
        const filter = filterMapper.map({
            productName,
            stockId,
            productId,
            limit,
            page,
            orderBy,
            onlyDeleted,
            withDeleted,
        })

        const ps = await findManyUseCase.execute(filter);
        
        return NextResponse.json(ps, { status: 200 });
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