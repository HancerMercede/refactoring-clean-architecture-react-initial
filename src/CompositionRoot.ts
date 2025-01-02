import { ProductApiRepository } from "./data/api/ProductApiRepository";
import { StoreApi } from "./data/api/StoreApi";
import { GetProcductByIdUseCase } from "./domain/GetProductByIdUseCase";
import { GetProcductsUseCase } from "./domain/GetProductsUseCase";

export class CompositionRoot {
    private constructor() {}

    private static instance: CompositionRoot;

    private storeApi = new StoreApi();
    private repository = new ProductApiRepository(this.storeApi);

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }
        return CompositionRoot.instance;
    }

    provideGetProductsUseCase(): GetProcductsUseCase {
        return new GetProcductsUseCase(this.repository);
    }

    provideGetProductByIdUseCase(): GetProcductByIdUseCase {
        return new GetProcductByIdUseCase(this.repository);
    }

    provideStoreApi(): StoreApi {
        return this.storeApi;
    }
}
