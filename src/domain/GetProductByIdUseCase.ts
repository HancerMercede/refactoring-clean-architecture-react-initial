import { IProductRepository, ResourceNotFound } from "./IProductRepository";
import { Product } from "./Product";

export class GetProcductByIdUseCase {
    constructor(private producRepository: IProductRepository) {}

    async Execute(id: number): Promise<Product> {
        try {
            const product = await this.producRepository.getById(id);

            return product;
        } catch (error) {
            throw new ResourceNotFound(`Product with id ${id} not found`);
        }
    }
}
