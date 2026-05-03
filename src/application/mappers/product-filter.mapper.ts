// map recebe todos os filtros para pesquisa de produtos
// retorna um novo filtro com os ids das cores e materiais

import { ProductSize } from "@/src/domain/enums/product-size.enum";
import { ProductType } from "@/src/domain/enums/product-type.enum";
import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { ModelRepository } from "@/src/domain/repositories/model.repository";

type FindProductFilteredInputDto = Readonly<{
    name?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    barcode?: string;
    type?: ProductType;

    mlProductId?: string;
    models?: string[];
    colors?: string[];
    materials?: string[];

    onlyDeleted?: string,
    withDeleted?: string,

    orderBy?: string;
    page?: number;
    limit?: number;
}>

export type FindProductFilteredOutputDto = Readonly<{
    name?: string,
    barcode?: string,
    type?: ProductType,
    size?: ProductSize;

    price?: {
        gte?: number,
        lte?: number,
    },
    maxPrice?: number,
    minPrice?: number,

    mlProductId?: string,
    colorIds?: string[];
    materialIds?: string[];
    modelIds?: string[];

    page?: number;
    limit?: number;
    orderBy?: {
        field: "name" | "price" | "createdAt";
        direction: "asc" | "desc";
    };

    onlyDeleted?: boolean,
    withDeleted?: boolean,
}>

export class ProductFilterMapper {
    constructor(
        private readonly colorRepository: ColorRepository,
        private readonly materialRepository: MaterialRepository,
        private readonly modelRepository: ModelRepository,
    ) { }

    async map(input: FindProductFilteredInputDto): Promise<FindProductFilteredOutputDto> {
        const minPrice = input.minPrice ? Number(input.minPrice) : 0;
        const maxPrice = input.maxPrice ? Number(input.maxPrice) : undefined;

        // convertendo materais para materiaisId
        const materialIds = input.materials?.length
            ? (await this.materialRepository.findByNames(input.materials)).map(m => m.id)
            : undefined;

        // convertendo modelos para modelId
        const modelIds = input.models?.length
            ? (await this.modelRepository.findByNames(input.models)).map(m => m.id)
            : undefined;                    

        // validar o size e tipo 
        // para evitar erros
        const allowedSizes = Object.values(ProductSize);
        const size = allowedSizes.includes(input.size as ProductSize)
            ? input.size as ProductSize
            : undefined;

        const allowedTypes = Object.values(ProductType);
        const type = allowedTypes.includes(input.type as ProductType)
            ? input.type as ProductType
            : undefined;
            
        // - CONTROLE PARA ITEMS DELETADOS -
        // onlyDeleted possui dois estados:
        // true: traz apénas items deletados                <--
        // false: 'executa o withDeleted'                   <--
        // pode trazer todos ou apenas
        // items que não foram deletados
        const onlyDeleted = !!input.onlyDeleted; //         <--            
        // withDeleted pode ter dois estados:
        // true: traz todos items 'incluindo deletados'     <--
        // false: traz apénas items não deletados           <--
        const withDeleted = !!input.withDeleted; //         <--
        console.log("INPUT: ", input)
        return {
            name: input.name,
            maxPrice,
            minPrice,
            type,
            size,
            barcode: input.barcode,
            mlProductId: input.mlProductId,
            modelIds,
            colorIds: input.colors,
            materialIds,
            orderBy: this.mapOrderBy(input.orderBy),
            page: input.page,
            limit: input.limit,
            onlyDeleted,
            withDeleted
        }
    }

    // map para orderBy
    // recebe como string e retorna
    // field e direction tipados
    private mapOrderBy(orderBy?: string) {
        if (!orderBy) return undefined;

        const [field, direction] = orderBy.split(":");

        const allowedFields = ["name", "price", "createdAt"];
        const allowedDirections = ["asc", "desc"];

        if (
            !allowedFields.includes(field) ||
            !allowedDirections.includes(direction)
        ) {
            return undefined; // ou throw error
        }

        return {
            field: field as "name" | "price" | "createdAt",
            direction: direction as "asc" | "desc",
        };
    }
}