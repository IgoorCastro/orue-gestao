import { useEffect, useState } from "react";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { Product } from "@/src/ui/types/product";
import { feedback } from "@/src/ui/lib/feedback";
import { ProductService } from "@/src/ui/services/product.service";
import { ProductComponentService } from "@/src/ui/services/product-component.service";
import { handleApiError } from "@/src/ui/services/errors/handle-api-error";

export enum ProductType {
  PRODUCT = "PRODUCT",
  KIT = "KIT",
  PACKAGE = "PACKAGE",
}

export enum ProductSize {
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
}

export type SelectedProduct = Product & { quantity: number };

type useProductFromProps = {
  // initialDataToProduct?: Product; // utilziar para tipo PRODUTOS
  // initialDataToOthers?: Product; // utilizar para tipo KIT/ PACKAGE
  initialData?: Product;
  onSuccess: (product: Product) => void;
}

const productService = new ProductService("/product");
const productComponenteService = new ProductComponentService("/productComponent");

export function useProductForm(props: useProductFromProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<ProductType>(ProductType.PRODUCT);
  const [size, setSize] = useState<ProductSize | "">("");
  const [mlProductId, setMlProductId] = useState("");

  const [model, setModel] = useState<string>("");

  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedComponentsProducts, setSelectedComponentsProducts] = useState<SelectedProduct[]>([]);

  // effect para edit de items
  // caso um item inicial seja passado ao hook
  // ele monta os campos com esse produto
  useEffect(() => {
    if (!props.initialData) return;
    props.initialData?.type === ProductType.PRODUCT && mapDataToProduct(props.initialData);
    props.initialData?.type !== ProductType.PRODUCT && mapDataToKitAndPackage(props.initialData);
  }, [props.initialData])

  const mapDataToKitAndPackage = async (product: Product): Promise<void> => {
    // produto tipo KIT/ PACKAGE
    setName(product.name);
    setPrice(product.price);
    setType(product.type as ProductType);
    setMlProductId(product.mlProductId ?? "");

    try {
      // pesquisa por composição do produto
      const prodComp = await productComponenteService.findAll({ parentId: product.id });
      console.log("prodComp: ", prodComp)
      if (!prodComp) feedback.error("Composição vazia ou não encontrada")
      setSelectedComponentsProducts(prodComp.map(pc => ({
        ...pc.componentProduct,
        quantity: pc.quantity
      }))
      );
    } catch (error) {
      feedback.dismiss();
      feedback.error(error); // O utilitário já trata a mensagem de erro da API
    }
  }

  const mapDataToProduct = (product: Product): void => {
    // produto tipo PRODUCT
    setName(product.name);
    setPrice(product.price);
    setType(product.type as ProductType);
    setSize(product.size as ProductSize);
    setMlProductId(product.mlProductId ?? "");

    setModel(product.modelId ?? "");

    setColors(product.productColor.map(pc => pc.color));
    setMaterials(product.productMaterial.map(pm => pm.material))
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    feedback.loading("Processando entrada produto...");
    try {
      const product = isUpdate() ? await updateProduct(productService) : await createProduct(productService, productComponenteService);
      feedback.dismiss(); // Remove o loading
      feedback.success(`Entrada de produto realizada com sucesso!`);
      props.onSuccess(product);
    } catch (error) {
      feedback.dismiss();
      feedback.error(error); // O utilitário já trata a mensagem de erro da API
    }
  };

  // função para criar um novo produto
  const createProduct = async (productService: ProductService, pcService: ProductComponentService) => {
    try {
      // primeiro criar o produto
      // NECESSARIO A ID DO PRODUTO PARA GERAR A COMPOSIÇÃO!
      const newProduct = await productService.create({
        name, price, type, size,
        colorIds: colors.map(c => c.id),
        materialIds: materials.map(m => m.id),
        modelId: model,
        mlProductId
      });

      // caso for KIT/ PACKAGE, preparar as promises da composição
      if (type !== ProductType.PRODUCT) {
        const compositionPromises = selectedComponentsProducts.map((item) =>
          pcService.create({
            componentProductId: item.id,
            quantity: item.quantity,
            parentProductId: newProduct.id,
          })
        );

        // executando todas as promises ao mesmo tempo
        await Promise.all(compositionPromises);

        return newProduct;
      }
    } catch (error) {
      handleApiError(error);
    }
  }

  // função para editar um produto
  const updateProduct = async (service: ProductService) => {
    if (props.initialData) {
      return await service.update(props.initialData.id, {
        name, price, type, size, colorIds: colors.map(c => c.id),
        materialIds: materials.map(m => m.id), modelId: model,
        mlProductId, sku: props.initialData.sku, updatedAt: props.initialData.updatedAt,
      });
    }
  }

  // função para saber se o form é para update ou create
  const isUpdate = () => !!props.initialData;

  return {
    // fields
    name,
    price,
    type,
    size,
    mlProductId,
    model,
    colors,
    materials,
    selectedComponentsProducts,

    // setters
    setName,
    setPrice,
    setType,
    setSize,
    setMlProductId,
    setSelectedComponentsProducts,
    setModel,
    setColors,
    setMaterials,

    // utils
    handleSubmit,
    isUpdate,
  };
}