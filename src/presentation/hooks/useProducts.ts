import { useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProcductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";

export function useProducts(_getProductsUseCase: GetProcductsUseCase) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        _getProductsUseCase.Execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products);
        });
    }, [reloadKey, _getProductsUseCase]);

    return { reload, products };
}
