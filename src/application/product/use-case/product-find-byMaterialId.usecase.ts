// import { ProductRepository } from "@/src/domain/repositories/product.repository";
// import { FindProductByMaterialIdInputDto, FindProductOutputDto } from "../dto/product-find.dto";

// export class FindProductsByMaterialUseCase {
//     constructor(
//         private productRepository: ProductRepository,
//     ) { }

//     async execute(input: FindProductByMaterialIdInputDto): Promise<FindProductOutputDto[]> {
//         if (!input.materialId?.trim()) throw new Error("Product material cannot be empty");
//         const products = await this.productRepository.findByMaterialId(input.materialId);

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