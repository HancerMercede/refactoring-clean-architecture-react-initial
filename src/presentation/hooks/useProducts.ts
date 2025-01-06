import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProcductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProcductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../domain/IProductRepository";
import { Price, ValidationError } from "../../domain/Price";
import {
    ActionNotAllowedError,
    UpdateProductPriceUseCase,
} from "../../domain/UpdateProductPriceUseCase";
import { Message, ProductViewModel, useProductsState } from "./useProductsState";

export function useProducts(
    _getProductsUseCase: GetProcductsUseCase,
    getProcductByIdUseCase: GetProcductByIdUseCase,
    UpdateProductPriceUseCase: UpdateProductPriceUseCase
): useProductsState {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<ProductViewModel[]>([]);

    const [message, setMessage] = useState<Message>();

    const { currentUser } = useAppContext();

    const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);

    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        _getProductsUseCase.Execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products.map(buildProductViewModel));
        });
    }, [reloadKey, _getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setMessage({
                        type: "Error",
                        text: "Only admin users can edit the price of a product",
                    });
                    return;
                }
                try {
                    const product = await getProcductByIdUseCase.Execute(id);
                    setEditingProduct(buildProductViewModel(product));
                } catch (error) {
                    if (error instanceof ResourceNotFound) {
                        setMessage({ type: "Error", text: error.message });
                    } else {
                        setMessage({ type: "Error", text: "Unexpected error has occurred." });
                    }
                }
            }
        },
        [currentUser, getProcductByIdUseCase]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    const onChangePrice = useCallback(
        (price: string) => {
            if (!editingProduct) return;

            try {
                setEditingProduct({ ...editingProduct, price: price });

                Price.create(price);

                setPriceError(undefined);
            } catch (error) {
                if (error instanceof ValidationError) {
                    setMessage({ type: "Error", text: error.message });
                } else {
                    setMessage({ type: "Error", text: "Unexpected error has occurred." });
                }
            }
        },
        [editingProduct]
    );

    const saveEditPrice = useCallback(async () => {
        if (editingProduct) {
            try {
                await UpdateProductPriceUseCase.Execute(
                    currentUser,
                    editingProduct.id,
                    editingProduct.price
                );

                setMessage({
                    type: "success",
                    text: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
                });
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                if (error instanceof ActionNotAllowedError) {
                    setMessage({
                        type: "Error",
                        text: error.message,
                    });
                } else {
                    setMessage({
                        type: "Error",
                        text: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
                    });
                    setEditingProduct(undefined);
                    reload();
                }
            }
        }
    }, [UpdateProductPriceUseCase, currentUser, editingProduct, reload]);

    const onCloseMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    return {
        products,
        updatingQuantity,
        editingProduct,
        message,
        cancelEditPrice,
        onChangePrice,
        priceError,
        saveEditPrice,
        onCloseMessage,
    };
}

function buildProductViewModel(product: Product): ProductViewModel {
    return {
        ...product,
        price: product.price.value.toFixed(2),
    };
}
