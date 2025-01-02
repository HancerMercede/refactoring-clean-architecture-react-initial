import { Product } from "./Product";
export class ResourceNotFound extends Error {}
export interface IProductRepository {
    getAll(): Promise<Product[]>;

    getById(id: number): Promise<Product>;
}
