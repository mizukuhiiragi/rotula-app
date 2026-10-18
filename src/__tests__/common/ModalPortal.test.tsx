import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/common/Modal/Modal";

describe("Modal Portal Rendering", () => {
  it("renders the modal dialog into document.body portal outside of its mount container", () => {
    const { container } = render(
      <div id="parent-container" style={{ transform: "translate3d(10px, 10px, 0)" }}>
        <Modal isOpen={true} onClose={vi.fn()} title="Portal Dialog">
          <p>Dialog inside portal</p>
        </Modal>
      </div>
    );

    const parentContainer = container.querySelector("#parent-container");
    expect(parentContainer).toBeInTheDocument();

    // The modal overlay should NOT be inside the parent container
    const dialogTitle = screen.getByText("Portal Dialog");
    expect(parentContainer?.contains(dialogTitle)).toBe(false);

    // The modal overlay must be rendered directly inside document.body
    expect(document.body.contains(dialogTitle)).toBe(true);

    const overlay = dialogTitle.closest(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();
    expect(overlay?.parentElement).toBe(document.body);
  });

  it("handles close button interactions when portaled", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Closable Portal">
        <p>Content</p>
      </Modal>
    );

    const closeBtn = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not mount in document.body when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Closed Portal">
        <p>Hidden</p>
      </Modal>
    );

    expect(screen.queryByText("Closed Portal")).toBeNull();
  });
});
