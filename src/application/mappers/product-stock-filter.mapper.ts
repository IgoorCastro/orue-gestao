// map para filtros do Product Stock
// converte as entradas 'string' em seus devidos tipos

type FindProductStockFilterInputDto = Readonly<{
    productName?: string

    productId?: string
    stockId?: string

    page?: string
    limit?: string

    orderBy?: string
    onlyDeleted?: string
    withDeleted?: string
}>

type FindProductStockFilteredOutputDto = Readonly<{
    productName?: string

    productId?: string
    stockId?: string

    onlyDeleted?: boolean
    withDeleted?: boolean

    page?: number;
    limit?: number;

    orderBy?: {
        field: "quantity";
        direction: "asc" | "desc";
    };
}>

export class ProductStockFilterMapper {
    map(input: FindProductStockFilterInputDto): FindProductStockFilteredOutputDto {
        const onlyDeleted = input.onlyDeleted
            ? true
            : false;
        const withDeleted = input.withDeleted
            ? true
            : false;

        const page = input.page
            ? Number(input.page)
            : undefined;
        const limit = input.limit
            ? Number(input.limit)
            : undefined;

        return {
            productName: input.productName,
            stockId: input.stockId,
            productId: input.productId,
            onlyDeleted,
            withDeleted,
            page,
            limit,
            orderBy: this.mapOrderBy(input.orderBy),
        }
    }

    private mapOrderBy(orderBy?: string) {
        if (!orderBy) return undefined;

        const [field, direction] = orderBy.split(":");

        const allowedFields = ["quantity"];
        const allowedDirections = ["asc", "desc"];

        if (
            !allowedFields.includes(field) ||
            !allowedDirections.includes(direction)
        ) {
            return undefined;
        }

        return {
            field: field as "quantity",
            direction: direction as "asc" | "desc",
        };
    }
}