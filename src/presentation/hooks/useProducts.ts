import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProcductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProcductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../domain/IProductRepository";

export function useProducts(
    _getProductsUseCase: GetProcductsUseCase,
    getProcductByIdUseCase: GetProcductByIdUseCase
) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);

    const [error, setError] = useState<string>();

    const { currentUser } = useAppContext();

    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const [priceError, setPriceError] = useState<string | undefined>(undefined);

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
                try {
                    const product = await getProcductByIdUseCase.Execute(id);
                    setEditingProduct(product);
                } catch (error) {
                    if (error instanceof ResourceNotFound) {
                        setError(error.message);
                    } else {
                        setError("Unexpected error has occurred: ");
                    }
                }
            }
        },
        [currentUser, getProcductByIdUseCase]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        const isValidNumber = !isNaN(+price);
        setEditingProduct({ ...editingProduct, price: price });

        if (!isValidNumber) {
            setPriceError("Only numbers are allowed");
        } else {
            if (!priceRegex.test(price)) {
                setPriceError("Invalid price format");
            } else if (+price > 999.99) {
                setPriceError("The max possible price is 999.99");
            } else {
                setPriceError(undefined);
            }
        }
    }

    return {
        reload,
        products,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        error,
        cancelEditPrice,
        onChangePrice,
        priceError,
    };
}
const priceRegex = /^\d+(\.\d{1,2})?$/;
