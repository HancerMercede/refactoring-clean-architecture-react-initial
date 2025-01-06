import { IProductRepository } from "../../domain/IProductRepository";
import { Product } from "../../domain/Product";
import { RemoteProduct, StoreApi } from "./StoreApi";

export class ProductApiRepository implements IProductRepository {
    constructor(private storeApi: StoreApi) {}

    async getAll(): Promise<Product[]> {
        const remoteProducts = await this.storeApi.getAll();

        return remoteProducts.map(buildProduct);
    }

    async getById(id: number): Promise<Product> {
        const remoteProduct = await this.storeApi.get(id);

        return buildProduct(remoteProduct);
    }

    async save(product: Product): Promise<void> {
        const remoteProduct = await this.storeApi.get(product.id);

        if (!remoteProduct) return;

        const editedRemoteProduct = {
            ...remoteProduct,
            price: Number(product.price.value),
        };
        return this.storeApi.post(editedRemoteProduct);
    }
}
function buildProduct(remoteProduct: RemoteProduct): Product {
    return Product.create({
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toString(),
    });
}
