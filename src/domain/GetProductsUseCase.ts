import { IProductRepository } from "./IProductRepository";
import { Product } from "./Product";

export class GetProcductsUseCase {
    constructor(private productRepository: IProductRepository) {}
    async Execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}
