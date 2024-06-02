import { afterAll, beforeAll, describe, test } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage";
import { AppProvider } from "../../context/AppProvider";
import { ReactNode } from "react";
import { MockWebServer } from "../../tests/MockWebServer";
import productResponse from "./data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("Products Page", () => {
    beforeAll(() => mockWebServer.start());
    afterAll(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("loads and displays title", () => {
        givenAProducts();

        renderComponent(<ProductsPage />);

        screen.findAllByRole("heading", { name: "Product price updater" });
    });
});

function givenAProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: productResponse,
        },
    ]);
}

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
