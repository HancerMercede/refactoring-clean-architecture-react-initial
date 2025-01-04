import { useCallback, useEffect, useState } from "react";
import { useReload } from "./useReload";
import { GetProcductsUseCase } from "../../domain/GetProductsUseCase";
import { Product, ProductData, ProductStatus } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProcductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../domain/IProductRepository";
import { Price, ValidationError } from "../../domain/Price";
import { StoreApi } from "../../data/api/StoreApi";

export type ProductViewModel = ProductData & { status: ProductStatus };

type Message = { type: "Error" | "success"; text: string };
export function useProducts(
    _getProductsUseCase: GetProcductsUseCase,
    getProcductByIdUseCase: GetProcductByIdUseCase,
    storeApi: StoreApi
) {
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

    function onChangePrice(price: string): void {
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
    }

    async function saveEditPrice(): Promise<void> {
        if (editingProduct) {
            const remoteProduct = await storeApi.get(editingProduct.id);

            if (!remoteProduct) return;

            const editedRemoteProduct = {
                ...remoteProduct,
                price: Number(editingProduct.price),
            };

            try {
                await storeApi.post(editedRemoteProduct);

                setMessage({
                    type: "success",
                    text: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
                });
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                setMessage({
                    type: "Error",
                    text: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
                });
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    const onCloseMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    return {
        reload,
        products,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
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
