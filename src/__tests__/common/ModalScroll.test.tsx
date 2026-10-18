import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/common/Modal/Modal";

describe("Modal Height and Scrolling Behavior", () => {
  it("constrains dialog to viewport height and applies scrollable overflow on body", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Scrollable Dialog">
        <div style={{ height: "1200px" }}>
          <p>Top of tall content</p>
          <button type="submit">Submit Action</button>
        </div>
      </Modal>
    );

    // Dialog card has viewport height constraints and flex-col
    const dialogCard = container.querySelector(".rounded-2xl");
    expect(dialogCard).toBeInTheDocument();
    expect(dialogCard?.className).toContain("max-h-[calc(100vh-2rem)]");
    expect(dialogCard?.className).toContain("flex");
    expect(dialogCard?.className).toContain("flex-col");

    // Header has shrink-0 to prevent collapsing
    const header = dialogCard?.firstElementChild;
    expect(header?.className).toContain("shrink-0");

    // Body content area has overflow-y-auto
    const bodyArea = dialogCard?.lastElementChild;
    expect(bodyArea?.className).toContain("overflow-y-auto");

    // Both top content and bottom submit button are accessible in the DOM
    expect(screen.getByText("Scrollable Dialog")).toBeInTheDocument();
    expect(screen.getByText("Top of tall content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Action" })).toBeInTheDocument();
  });

  it("renders short content naturally without forcing expansion", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Short Dialog">
        <p>A simple message.</p>
      </Modal>
    );

    expect(screen.getByText("Short Dialog")).toBeInTheDocument();
    expect(screen.getByText("A simple message.")).toBeInTheDocument();
  });
});
