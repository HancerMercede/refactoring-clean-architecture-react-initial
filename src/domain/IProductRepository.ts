import { Product } from "./Product";

export interface IProductRepository {
    getAll(): Promise<Product[]>;
}
