// import { ProductRepository } from "@/src/domain/repositories/product.repository";
// import { FindProductByColorIdInputDto, FindProductOutputDto } from "../dto/product-find.dto";

// export class FindProductsByColorUseCase {
//     constructor(
//         private productRepository: ProductRepository,
//     ) { }

//     async execute(input: FindProductByColorIdInputDto): Promise<FindProductOutputDto[]> {
//         if (input.colorId.length === 0) throw new Error("Color cannot be empty");
//         const products = await this.productRepository.findByColorId(input.colorId);

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