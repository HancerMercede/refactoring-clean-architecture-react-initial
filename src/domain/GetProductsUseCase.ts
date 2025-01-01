import { RemoteProduct, StoreApi } from "../data/api/StoreApi";
import { Product } from "./Product";

export class GetProcductsUseCase {
    constructor(private storeApi: StoreApi) {}
    async Execute(): Promise<Product[]> {
        const remoteProducts = await this.storeApi.getAll();

        return remoteProducts.map(buildProduct);
    }
}
export function buildProduct(remoteProduct: RemoteProduct): Product {
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
