import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProcductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { StoreApi } from "../../data/api/StoreApi";
import { useAppContext } from "../context/useAppContext";
import { buildProduct } from "../../data/api/ProductApiRepository";

export function useProducts(_getProductsUseCase: GetProcductsUseCase, store: StoreApi) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);

    const [error, setError] = useState<string>();

    const { currentUser } = useAppContext();

    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    useEffect(() => {
        _getProductsUseCase.Execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products);
        });
    }, [reloadKey, _getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                store
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser, store]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    return {
        reload,
        products,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        error,
        cancelEditPrice,
    };
}
