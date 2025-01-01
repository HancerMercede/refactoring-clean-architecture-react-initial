import { useEffect, useState } from "react";
import { RemoteProduct, StoreApi } from "../api/StoreApi";
import { useReload } from "./useReload";

export function useProducts(storeApi: StoreApi) {
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        storeApi.getAll().then(response => {
            console.debug("Reloading", reloadKey);

            const remoteProducts = response as RemoteProduct[];

            const products = remoteProducts.map(buildProduct);

            setProducts(products);
        });
    }, [reloadKey, storeApi]);

    return { reload, products };
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}

export interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
}
