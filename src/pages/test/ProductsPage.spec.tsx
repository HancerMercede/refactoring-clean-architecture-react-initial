import { test } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { ProductsPage } from "../ProductsPage";
import { AppProvider } from "../../context/AppProvider";
import { ReactNode } from "react";

test("loads and displays title", () => {
    renderComponent(<ProductsPage />);

    screen.findAllByRole("heading", { name: "Product price updater" });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
