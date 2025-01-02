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
}
function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}
