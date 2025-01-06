import { ProductData, ProductStatus } from "../../domain/Product";

export type ProductViewModel = ProductData & { status: ProductStatus };

export type Message = { type: "Error" | "success"; text: string };

export type useProductsState = {
    products: ProductViewModel[];
    updatingQuantity: (id: number) => Promise<void>;
    message: Message | undefined;
    cancelEditPrice: () => void;
    onChangePrice: (price: string) => void;
    priceError: string | undefined;
    saveEditPrice: () => Promise<void>;
    onCloseMessage: () => void;
    editingProduct: ProductViewModel | undefined;
};
