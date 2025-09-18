import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaymentPopup } from "./PaymentPopup";

describe("PaymentPopup", () => {
  const service = {
    _id: "1",
    name: "Pro",
    price: 9.5,
    icon: "Box",
    category: "Box",
  } as any;

  it("renders nothing when closed", () => {
    const { container } = render(
      <PaymentPopup
        open={false}
        service={null}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders and confirms payment", () => {
    const onConfirm = vi.fn();
    render(
      <PaymentPopup
        open={true}
        service={service}
        onClose={() => {}}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(screen.getByLabelText("PayPal"));
    fireEvent.click(screen.getByRole("button", { name: /pay/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
