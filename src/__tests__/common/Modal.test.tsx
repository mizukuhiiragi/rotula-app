import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/common/Modal/Modal";
import { InviteMemberModal } from "@/components/groups/InviteMemberModal";

describe("Modal Accessibility and Flexible Heading Level", () => {
  it("renders an accessible dialog with name from title and defaults to heading level 2", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Dialog body content</p>
      </Modal>
    );

    // Dialog has accessible name
    const dialog = screen.getByRole("dialog", { name: "Test Dialog" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    // Default heading level is h2 (no skipped heading level under page h1)
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Dialog");
  });

  it("allows callers to customize the heading level according to document outline", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Custom H3" headingLevel="h3">
        <p>Dialog body</p>
      </Modal>
    );

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Custom H3");

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} title="Custom H4" headingLevel="h4">
        <p>Dialog body</p>
      </Modal>
    );

    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Custom H4");
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Closable">
        <p>Content</p>
      </Modal>
    );

    const closeBtn = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("forwards headingLevel through InviteMemberModal", () => {
    render(
      <InviteMemberModal
        isOpen={true}
        onClose={vi.fn()}
        onInvite={vi.fn()}
        headingLevel="h2"
      />
    );

    const dialog = screen.getByRole("dialog", { name: "Invite Member" });
    expect(dialog).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Invite Member");
  });
});
