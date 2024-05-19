import { test } from "vitest";
import App from "../../App";
import { render, screen } from "@testing-library/react";

test("loads and displays title", () => {
    render(<App />);

    screen.findAllByRole("heading", { name: "Product price updater" });
});
