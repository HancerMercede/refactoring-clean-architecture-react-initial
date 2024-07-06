import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { ProductsPage } from "../../ProductsPage";
import { AppProvider } from "../../../context/AppProvider";
import { ReactNode } from "react";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenProducts, givenThereAreNotProducts } from "./productsPage.fixture";
import {
    openDialogToEditPrice,
    typePrice,
    verfifyDialogo,
    verifyError,
    verifyHeader,
    verifyRows,
    waitToTableIsLoaded,
} from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

describe("Products Page", () => {
    beforeAll(() => mockWebServer.start());
    afterAll(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("loads and displays title", () => {
        givenAProducts(mockWebServer);

        renderComponent(<ProductsPage />);

        screen.findAllByRole("heading", { name: "Product price updater" });
    });
});
describe("Table", () => {
    test("should show an empty table if there are not data", async () => {
        givenThereAreNotProducts(mockWebServer);

        renderComponent(<ProductsPage />);

        const rows = await screen.findAllByRole("row");

        expect(rows.length).toBe(1);

        verifyHeader(rows[0]);
    });

    test("should show expected header and rows in the table", async () => {
        const products = givenProducts(mockWebServer);

        renderComponent(<ProductsPage />);

        await waitToTableIsLoaded();

        const allRows = await screen.findAllByRole("row");

        const [header, ...rows] = allRows;

        verifyHeader(header);

        verifyRows(rows, products);
    });
});

describe("Edit price", () => {
    test("Should show a dialog with the product", async () => {
        const products = givenProducts(mockWebServer);

        renderComponent(<ProductsPage />);
        await waitToTableIsLoaded();

        const dialog = await openDialogToEditPrice(0);

        verfifyDialogo(dialog, products[0]);
    });

    test("Show an error message for negative prices", async () => {
        givenProducts(mockWebServer);

        renderComponent(<ProductsPage />);
        await waitToTableIsLoaded();

        const dialog = await openDialogToEditPrice(0);

        await typePrice(dialog, "-4");
        await verifyError(dialog, "Invalid price format");
    });

    test("Show an error message for non number prices", async () => {
        givenProducts(mockWebServer);

        renderComponent(<ProductsPage />);
        await waitToTableIsLoaded();

        const dialog = await openDialogToEditPrice(0);

        await typePrice(dialog, "nonnumeric");
        await verifyError(dialog, "Only numbers are allowed");
    });

    test("Show an error message for prices greater than maximun", async () => {
        givenProducts(mockWebServer);

        renderComponent(<ProductsPage />);
        await waitToTableIsLoaded();

        const dialog = await openDialogToEditPrice(0);

        await typePrice(dialog, "10000");
        await verifyError(dialog, "The max possible price is 999.99");
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
