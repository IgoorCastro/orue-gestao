// import { ProductColorRepository } from "@/src/domain/repositories/product-color.repository";
// import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
// import { CreateProductColorInputDto, CreateProductColorOutputDto } from "../dto/product-color-create.dto";
// import { ProductColor } from "@/src/domain/entities/product-color";
// import { ColorRepository } from "@/src/domain/repositories/color.repository";
// import { ProductRepository } from "@/src/domain/repositories/product.repository";

// export class CreateProductColorUseCase {
//     constructor(
//         private productColorRepository: ProductColorRepository,
//         private colorRepository: ColorRepository,
//         private productRepository: ProductRepository,
//         private uuid: UuidGenerator,
//     ) { }

//     async execute(input: CreateProductColorInputDto): Promise<CreateProductColorOutputDto> {
//         const product = await this.productRepository.findById(input.productId);
//         if (!product) throw new Error("Product not found");

//         const color = await this.colorRepository.findById(input.colorId);
//         if (!color) throw new Error("Color not found");
        
//         // verifica se ja existe relação entre uma cor e um produto
//         const existingProductColor = await this.productColorRepository.findByProductAndColorId(input.colorId, input.productId);
//         if (existingProductColor) throw new Error("Product color is already registered");

//         const pc = new ProductColor({
//             id: this.uuid.generate(),
//             colorId: input.colorId,
//             productId: input.productId,
//         });

//         await this.productColorRepository.create(pc);

//         return {
//             id: pc.id,
//             colorId: pc.colorId,
//             productId: pc.productId,
//         }
//     }
// }