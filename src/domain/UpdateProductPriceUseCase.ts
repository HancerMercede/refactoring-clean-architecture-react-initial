import { ProductApiRepository } from "../data/api/ProductApiRepository";
import { User } from "../presentation/context/AppContext";

export class ActionNotAllowedError extends Error {}

export class UpdateProductPriceUseCase {
    constructor(private productRepository: ProductApiRepository) {}

    async Execute(user: User, id: number, price: string): Promise<void> {
        if (!user.isAdmin) {
            throw new ActionNotAllowedError("Only admin users can edit the price of a product");
        }
        const product = await this.productRepository.getById(id);

        const editedProduct = product.editPrice(price);
        return await this.productRepository.save(editedProduct);
    }
}
