import { describe, expect, test } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    test("should create product with status active and price is greater than 0", async () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

        expect(product.status).toBe("active");
    });

    test("should create product with status inactive and price is equal to 0", async () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "0" });

        expect(product.status).toBe("inactive");
    });

    test("should edit product and assign status active, if the new price is greater than 0", async () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

        const editedProduct = product.editPrice("4.5");
        expect(editedProduct.status).toBe("active");
        expect(editedProduct.price.value).toBe(4.5);
    });
    test("should edit Price and assign status inactive if new price is 0", () => {
        const product = Product.create({ id: 1, title: "title", image: "image", price: "2.4" });

        const editedPrice = product.editPrice("0");

        expect(editedPrice.status).toBe("inactive");
        expect(editedPrice.price.value).toBe(0);
    });
});
