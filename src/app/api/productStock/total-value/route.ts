

// Rota GET
// Get com params via URL
// usar para pesquisa com filtros
// filtros: productId e stockId

import { DomainError } from "@/src/domain/errors/domain.error";
import { NextResponse } from "next/server";
import mapDomainErrorToStatus from "../../mapDomainErrorToStatus.error";
import { GetProductStockValueUseCase } from "@/src/application/product-stock/usecase/product-stock-get-stock-value";
import { PrismaProductStockRepository } from "@/src/infrastructure/database/repositories/prisma-product-stock.repository";
import { prisma } from "@/src/infrastructure/database/prisma/client";

//
export async function GET(req: NextResponse) {
    try{
        const { searchParams } = new URL(req.url);
        
        const stockId = searchParams.get("stockId") ?? undefined;
        const productId = searchParams.get("productId") ?? undefined;

        const multUseCase = new GetProductStockValueUseCase(new PrismaProductStockRepository(prisma));

        const value = await multUseCase.execute({ productId, stockId });

        console.log("value: ", value)
                
        return NextResponse.json(value, { status: 200 });
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