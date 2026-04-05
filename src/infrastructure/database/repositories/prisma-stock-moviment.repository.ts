import { PrismaClient, StockMovimentType as PrismaStockMovimentType, StockMoviment as PrismaStockMoviment, Prisma } from "@/generated/prisma/client";
import { StockMoviment } from "@/src/domain/entities/stock-moviment.entity";
import { StockMovimentType } from "@/src/domain/enums/stock-moviment-type.enum";
import { StockMovimentRepository } from "@/src/domain/repositories/stock-moviment.repository";
import { StockMovimentFilters } from "@/src/domain/types/stock-moviment-filters.type";

export class PrismaStockMovimentRepository implements StockMovimentRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<StockMoviment | null> {
        const sm = await this.prisma.stockMoviment.findUnique({
            where: { id },
            include: this.defaultInclude,
        })

        if (!sm) return null;

        return this.toDomain(sm);
    }

    async findMany(): Promise<StockMoviment[]> {
        const sms = await this.prisma.stockMoviment.findMany({
            include: this.defaultInclude,
        });

        return sms.map(sm => this.toDomain(sm));
    }

    async findWithFilters(filters: StockMovimentFilters): Promise<{ data: StockMoviment[]; total: number; }> {
        const where: Prisma.StockMovimentWhereInput = {
            ...(filters.type && { type: filters.type as PrismaStockMovimentType }),
            ...(filters.quantity && { quantity: filters.quantity }),
            ...(filters.fromStockId && { fromStockId: filters.fromStockId }),
            ...(filters.toStockId && { toStockid: filters.toStockId }),
            ...(filters.productStockId && { productStockId: filters.productStockId }),
            ...(filters.userId && { userId: filters.userId }),
            
            totalPrice: filters.price
                ? {
                    ...(filters.price.gte !== undefined && { gte: filters.price.gte }),
                    ...(filters.price.lte !== undefined && { lte: filters.price.lte }),
                }
                : undefined,

            createdAt: filters.createdAt
                ? {
                    ...(filters.createdAt.gte !== undefined && { gte: filters.createdAt.gte }),
                    ...(filters.createdAt.lte !== undefined && { lte: filters.createdAt.lte }),
                }
                : undefined,
        };

        // configuração da paginação
        const limit = filters.limit ?? 10;
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const orderBy = filters.orderBy
            ? { [filters.orderBy.field]: filters.orderBy.direction }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.stockMoviment.findMany({
                where,
                include: this.defaultInclude,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: orderBy,
            }),
            this.prisma.stockMoviment.count({ where })
        ]);

        return {
            data: data.map(sm => this.toDomain(sm)),
            total
        };
    }

    async save(stockMoviment: StockMoviment): Promise<void> {
        try {
            await this.prisma.stockMoviment.create({
                data: this.toPrismaCreate(stockMoviment),
            });
        } catch (error: unknown) {
            console.error("PRISMA ERROR:", error);
            throw error;
        }
    }


    // =========================
    // MAPPERS
    // =========================

    private toDomain(prismaSM: PrismaStockMoviment): StockMoviment {
        return StockMoviment.restore({
            id: prismaSM.id,
            type: this.mapTypeToDomain(prismaSM.type),
            unitPrice: prismaSM.unitPrice,
            totalPrice: prismaSM.totalPrice,
            quantity: prismaSM.quantity,
            productStockId: prismaSM.productStockId,
            fromStockId: prismaSM.fromStockId ?? undefined,
            toStockId: prismaSM.toStockid ?? undefined,
            userId: prismaSM.userId,
            createdAt: prismaSM.createdAt,
            updatedAt: prismaSM.updatedAt,
            deletedAt: prismaSM.deletedAt ?? undefined,
        });
    }

    private toPrismaCreate(sm: StockMoviment): Prisma.StockMovimentCreateInput {
        return {
            id: sm.id,
            type: sm.type as PrismaStockMovimentType,
            unitPrice: sm.unitPrice,
            totalPrice: sm.totalPrice,
            quantity: sm.quantity,
            ProductStock: { connect: { id: sm.productStockId } },
            Stock_StockMoviment_fromStockIdToStock: sm.fromStockId
                ? { connect: { id: sm.fromStockId } }
                : undefined,
            Stock_StockMoviment_toStockidToStock: sm.toStockId
                ? { connect: { id: sm.toStockId } }
                : undefined,
            User: { connect: { id: sm.userId } },
            createdAt: sm.createdAt,
            updatedAt: sm.updatedAt,
            deletedAt: null,
        };
    }

    // converte type do prisma para o enum do sistema
    private mapTypeToDomain(type: PrismaStockMovimentType): StockMovimentType {
        return type as StockMovimentType;
    }

    // =========================
    // DEFAULT INCLUDE
    // =========================

    private readonly defaultInclude = {
        ProductStock: {
            include: {
                product: true,
                stock: true, // se existir essa relação
            }
        },
        User: {
            select: {
                id: true,
                name: true,
            }
        },

        Stock_StockMoviment_fromStockIdToStock: {
            select: {
                id: true,
                name: true,
            }
        },

        Stock_StockMoviment_toStockidToStock: {
            select: {
                id: true,
                name: true,
            }
        },
    } satisfies Prisma.StockMovimentInclude;
}