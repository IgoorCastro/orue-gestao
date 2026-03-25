import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { FindProductFilteredDto, FindProductListOutputDto, FindProductOutputDto } from "../dto/product-find.dto";
import { Product } from "@/src/domain/entities/product.entity";
import { ValidationError } from "@/src/domain/errors/validation.error";

export class FindProductsUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(filters: FindProductFilteredDto): Promise<FindProductListOutputDto> {
        const hasDataFilters =
            filters.colorIds?.length ||
            filters.materialIds?.length ||
            filters.modelId ||
            filters.size;

        const hasPagination = filters.page || filters.limit;
        const hasOrdering = filters.orderBy;

        if (!hasDataFilters && !hasPagination && !hasOrdering) throw new ValidationError("At least one filter or control parameter must be provided");

        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;

        const { data, total } = await this.productRepository.findWithFilters({
            ...filters,
            page,
            limit,
        });

        return {
            data: data.map(product => this.toOutput(product)),
            total,
            page,
            limit,
        };
    }

    private toOutput(product: Product): FindProductOutputDto {
        return {
            id: product.id,
            name: product.name,
            size: product.size,
            type: product.type,
            price: product.price,
            sku: product.sku,
            modelId: product.modelId,
            colorIds: product.colors,
            materialIds: product.materials,
            barcode: product.barcode,
            mlProductId: product.mlProductId,
        };
    }
}