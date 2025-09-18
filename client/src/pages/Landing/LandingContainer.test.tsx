import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LandingContainer } from "./LandingContainer";

describe("LandingContainer", () => {
  it("renders landing content", () => {
    render(
      <MemoryRouter>
        <LandingContainer setMsisdn={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
