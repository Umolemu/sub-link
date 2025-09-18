import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("changes value", () => {
    const onChange = vi.fn();
    render(<Input placeholder="Type" onChange={onChange} />);
    const el = screen.getByPlaceholderText("Type") as HTMLInputElement;
    fireEvent.change(el, { target: { value: "a" } });
    expect(onChange).toHaveBeenCalled();
  });
});
