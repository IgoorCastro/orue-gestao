import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { UpdateProductComponentInputDto, UpdateProductComponentOutputDto } from "../dto/product-component-save.dto";
import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { ProductType } from "@/src/domain/enums/product-type.enum";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class UpdateProductComponentUseCase {
    constructor(
        private productComponentRepository: ProductComponentRepository,
        private productRepository: ProductRepository,
    ) { }

    async execeute(input: UpdateProductComponentInputDto): Promise<UpdateProductComponentOutputDto> {
        if (!input.id?.trim()) throw new ValidationError("Id cannot be empty");
        if (input.quantity !== undefined && input.quantity < 1) throw new ValidationError("Quantity must be greater than zero");

        const existingPc = await this.productComponentRepository.findById(input.id); // procura pelo pc para update
        if (!existingPc) throw new NotFoundError("Product component not found"); // erro pc nao encontrado

        // verifica o que sera atualizado
        const newParentId = input.parentProductId ?? existingPc.parentProductId;
        const newComponentId = input.componentProductId ?? existingPc.componentProductId;

        // evita o msm id como parent e component
        if (newParentId === newComponentId) throw new ValidationError("Product cannot be a component of itself");

        // validação para evitar duplicidade e ciclo
        await this.validateCompositionRules(newParentId, newComponentId, existingPc.id);

        if(newParentId !== existingPc.parentProductId) existingPc.changeParentProductId(newParentId);
        if(newComponentId !== existingPc.componentProductId) existingPc.changeComponentProductId(newComponentId);
        if (input.quantity !== undefined) existingPc.changeQuantity(input.quantity);

        await this.productComponentRepository.save(existingPc);

        return {
            id: existingPc.id,
            componentProductId: existingPc.componentProductId,
            parentProductId: existingPc.parentProductId,
            quantity: existingPc.quantity,
        };
    }

    private async validateCompositionRules(parentId: string, componentId: string, ignoreId?: string): Promise<void> {
        const [parentProduct, componentProduct] = await Promise.all([
            this.productRepository.findById(parentId),
            this.productRepository.findById(componentId)
        ]);

        if (!parentProduct) throw new NotFoundError("Parent product not found");
        if (parentProduct.type === ProductType.PRODUCT) throw new ValidationError("Product cannot have components");

        if (!componentProduct) throw new NotFoundError("Component product not found");
        if (componentProduct.type === ProductType.PACKAGE) throw new ValidationError("Package cannot be a component");

        if (parentProduct.type === ProductType.PACKAGE && componentProduct.type !== ProductType.KIT)
            throw new ValidationError("Package can only contain kits");
        if (parentProduct.type === ProductType.KIT && componentProduct.type !== ProductType.PRODUCT)
            throw new ValidationError("Kit can only contain products");

        const exists = await this.productComponentRepository.exists(
            parentId,
            componentId,
            ignoreId
        );
        if (exists) throw new ConflictError("Component already exists in this product");
    }
}