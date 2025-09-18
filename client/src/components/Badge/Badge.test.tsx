import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hi</Badge>);
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });
});
