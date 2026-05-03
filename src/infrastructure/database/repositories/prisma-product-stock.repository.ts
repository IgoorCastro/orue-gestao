import { PrismaClient, ProductStock as PrismaProductStock, Prisma } from "@/generated/prisma/client";
import { Color } from "@/src/domain/entities/color.entity";
import { ProductColor } from "@/src/domain/entities/product-color";
import { ProductStock } from "@/src/domain/entities/product-stock.entity";
import { Product } from "@/src/domain/entities/product.entity";
import { Stock } from "@/src/domain/entities/stock.entity";
import { Store } from "@/src/domain/entities/store.entity";
import { ProductSize } from "@/src/domain/enums/product-size.enum";
import { ProductType } from "@/src/domain/enums/product-type.enum";
import { StockType } from "@/src/domain/enums/stock-type.enum";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { ProductStockFilters } from "@/src/domain/types/product-stock-filters.type";

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        ProductColor: { include: { Color: true } },
        ProductMaterial: { include: { Material: true } },
    }
}>;


type StocktWithRelations = Prisma.StockGetPayload<{
    include: {
        Store: true,
    }
}>;

type ProductStockWithProduct = Prisma.ProductStockGetPayload<{
    include: {
        product: {
            include: {
                ProductColor: {
                    include: {
                        Color: true
                    }
                },
                ProductMaterial: {
                    include: {
                        Material: true
                    }
                }
            }
        },
        stock: {
            include: {
                Store: true,
            }
        }
    }
}>;


export class PrismaProductStockRepository implements ProductStockRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<ProductStock | null> {
        const productStock = await this.prisma.productStock.findFirst({
            where: { id, deletedAt: null },
        })

        if (!productStock) return null;

        return this.toDomain(productStock);
    }

    async findByProductId(productId: string): Promise<ProductStock[]> {
        const productStocks = await this.prisma.productStock.findMany({
            where: {
                productId,
                deletedAt: null,
            }
        })

        return productStocks.map(this.toDomain);
    }

    async findByStockId(stockId: string): Promise<ProductStock[]> {
        const productStocks = await this.prisma.productStock.findMany({
            where: {
                stockId,
                deletedAt: null
            },
            include: {
                product: true,
            }
        })

        return productStocks.map(this.toDomain);
    }

    async findByProductAndStockId(productId: string, stockId: string): Promise<ProductStock | null> {
        if (!productId || !stockId) return null;

        const productStock = await this.prisma.productStock.findFirst({
            where: {
                productId,
                stockId,
                deletedAt: null,
            }
        });

        if (!productStock) return null;

        return this.toDomain(productStock);
    }

    async findAll(): Promise<ProductStock[]> {
        const productStock = await this.prisma.productStock.findMany({
            where: { deletedAt: null }
        });

        return productStock.map(this.toDomain);
    }

    // find com filtro
    // retorna uma lista de produtos em estoque e pode ser filtrada
    async findMany(filters: ProductStockFilters) {
        const where: Prisma.ProductStockWhereInput = {
            productId: filters.productId,
            stockId: filters.stockId,
            product: {
                name: {
                    contains: filters.productName,
                    mode: 'insensitive',
                }
            }
        }

        // Configuração de paginação
        const limit = filters.limit ?? 10; // default limit: 10 item por request
        const page = filters.page && filters.page > 0 ? filters.page : 1; // default page: page 1
        const orderBy = filters.orderBy
            ? { [filters.orderBy.field]: filters.orderBy.direction }
            : undefined;

        const [data, total] = await Promise.all([
            this.prisma.productStock.findMany({
                where,
                include: {
                    product: {
                        include: {
                            ProductColor: {
                                include: { Color: true }
                            },
                            ProductMaterial: {
                                include: { Material: true }
                            }
                        }
                    },
                    stock: {
                        include: {
                            Store: true,
                        }
                    }
                },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: orderBy ?? { createdAt: "desc" },
            }),
            this.prisma.productStock.count({ where })
        ]);

        return {
            data: data.map(ps => this.toDomainWithInclude(ps)),
            total,
        }
    }



    async sumStockValue(filters?: { stockId?: string; productId?: string }): Promise<number> {
        const { stockId, productId } = filters || {};

        console.log("PRISMA >> FILTERS: ", filters)

        const result = await this.prisma.$queryRaw<{ total: number }[]>(
            Prisma.sql`
                SELECT COALESCE(SUM(ps.quantity * p.price), 0) as total
                FROM "ProductStock" ps
                JOIN "Product" p ON p.id = ps."productId"
                WHERE ps."deletedAt" IS NULL
                ${stockId ? Prisma.sql`AND ps."stockId" = ${stockId}` : Prisma.empty}
                ${productId ? Prisma.sql`AND ps."productId" = ${productId}` : Prisma.empty}
            `
        );

        return Number(result[0]?.total ?? 0);
    }

    async exists(productId: string, stockId: string, ignoreId?: string): Promise<boolean> {
        const exist = await this.prisma.productStock.findFirst({
            where: {
                productId,
                stockId,
                ...(ignoreId ? { id: { not: ignoreId } } : {}), // ignora um id específico 
                deletedAt: null
            }
        })

        return !!exist;
    }

    async save(item: ProductStock): Promise<void> {
        console.log("\n\nPRISMA >> ProductStock - Item: ", item)
        await this.prisma.productStock.upsert({
            where: { id: item.id },
            update: this.toPrismaUpdate(item),
            create: this.toPrismaCreate(item),
        });
    }

    // =========================
    // MAPPERS
    // =========================

    private toDomain(prismaProductStock: PrismaProductStock): ProductStock {
        return ProductStock.restore({
            id: prismaProductStock.id,
            productId: prismaProductStock.productId,
            stockId: prismaProductStock.stockId,
            quantity: prismaProductStock.quantity,
            createdAt: prismaProductStock.createdAt,
            updatedAt: prismaProductStock.updatedAt,
            deletedAt: prismaProductStock.deletedAt ?? undefined,
        });
    }

    private toDomainWithInclude(prismaProductStock: ProductStockWithProduct): ProductStock {
        return ProductStock.restore({
            id: prismaProductStock.id,
            productId: prismaProductStock.productId,
            stockId: prismaProductStock.stockId,
            quantity: prismaProductStock.quantity,
            createdAt: prismaProductStock.createdAt,
            updatedAt: prismaProductStock.updatedAt,
            deletedAt: prismaProductStock.deletedAt ?? undefined,

            product: prismaProductStock.product
                ? this.mapProduct(prismaProductStock.product)
                : undefined,

            stock: prismaProductStock.stock
                ? this.mapStock(prismaProductStock.stock)
                : undefined,
        });
    }

    private toPrismaUpdate(productStock: ProductStock): Prisma.ProductStockUpdateInput {
        return {
            quantity: productStock.quantity,
            updatedAt: productStock.updatedAt,
            deletedAt: productStock.deletedAt ?? null,
        };
    }

    private toPrismaCreate(productStock: ProductStock): Prisma.ProductStockCreateInput {
        return {
            id: productStock.id,
            quantity: productStock.quantity,
            product: { connect: { id: productStock.productId } },
            stock: { connect: { id: productStock.stockId } },
        };
    }

    private mapProduct(prismaProduct: ProductWithRelations): Product {
        return Product.restore({
            id: prismaProduct.id,
            name: prismaProduct.name,
            sku: prismaProduct.sku,
            normalizedName: prismaProduct.normalizedName,
            price: prismaProduct.price,
            modelId: prismaProduct.modelId ?? undefined,

            type: this.mapProductType(prismaProduct.type),
            size: this.mapProductSize(prismaProduct.size),

            barcode: prismaProduct.barcode ?? undefined,
            mlProductId: prismaProduct.mlProductId ?? undefined,

            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
            deletedAt: prismaProduct.deletedAt ?? undefined,

            colors: prismaProduct.ProductColor.map(pc => pc.Color.name),
            materials: prismaProduct.ProductMaterial.map(pm => pm.Material.name),

            productColor: prismaProduct.ProductColor
                ? prismaProduct.ProductColor.map((pc) => 
                    new ProductColor({
                        id: pc.id,
                        colorId: pc.colorId,
                        productId: pc.productId,
                        color: Color.restore({
                            id: pc.Color.id,
                            name: pc.Color.name,
                            normalizedName: pc.Color.normalizedName,
                            createdAt: pc.Color.createdAt,
                            updatedAt: pc.Color.updatedAt,
                            deletedAt: pc.Color.deletedAt ?? undefined,
                        }),
                    })
                )
                : undefined,
        });
    }

    private mapStock(prismaProduct: StocktWithRelations): Stock {
        // Aqui você cria a instância
        const storeInstance = prismaProduct.Store
            ? Store.restore({
                id: prismaProduct.Store.id,
                name: prismaProduct.Store.name,
                createdAt: prismaProduct.Store.createdAt,
                updatedAt: prismaProduct.Store.updatedAt,
                deletedAt: prismaProduct.Store.deletedAt ?? undefined,
            })
            : undefined;

        return Stock.restore({
            id: prismaProduct.id,
            name: prismaProduct.name,
            type: this.mapStockType(prismaProduct.type),
            storeId: prismaProduct.storeId ?? undefined,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
            deletedAt: prismaProduct.deletedAt ?? undefined,
            // Se o Stock.restore guarda a INSTÂNCIA, o problema persistirá na saída da API
            store: storeInstance,
        });
    }



    private mapProductType(type: string): ProductType {
        switch (type) {
            case "PRODUCT":
                return ProductType.PRODUCT;
            case "KIT":
                return ProductType.KIT;
            case "PACKAGE":
                return ProductType.PACKAGE;
            default:
                throw new Error(`Invalid ProductType: ${type}`);
        }
    }

    private mapStockType(type: string): StockType {
        switch (type) {
            case "MAIN":
                return StockType.MAIN;
            case "STORE":
                return StockType.STORE;
            default:
                throw new Error(`Invalid StockType: ${type}`);
        }
    }



    private mapProductSize(size: string | null): ProductSize | undefined {
        if (!size) return undefined;
        switch (size) {
            case "P":
                return ProductSize.P;
            case "M":
                return ProductSize.M;
            case "G":
                return ProductSize.G;
            case "GG":
                return ProductSize.GG;
            case "XG":
                return ProductSize.XG;
            default:
                console.warn(`Tamanho desconhecido encontrado: ${size}`);
                return undefined;
        }
    }
}

