// import { ProductRepository } from "@/src/domain/repositories/product.repository";
// import { FindProductByModelIdInputDto, FindProductOutputDto } from "../dto/product-find.dto";

// export class FindProductsByModelUseCase {
//     constructor(
//         private productRepository: ProductRepository,
//     ) { }

//     async execute(input: FindProductByModelIdInputDto): Promise<FindProductOutputDto[]> {
//         if (!input.modelId?.trim()) throw new Error("Product model cannot be empty");
//         const products = await this.productRepository.findByModelId(input.modelId);

//         return products.map(p => ({
//             id: p.id,
//             name: p.name,
//             price: p.price,
//             type: p.type,
//             size: p.size,
//             colorIds: p.colors,
//             materialIds: p.materials,
//             modelId: p.modelId,
//             sku: p.sku,
//             barcode: p.barcode,
//             mlProductId: p.mlProductId,
//         }));
//     }
// }