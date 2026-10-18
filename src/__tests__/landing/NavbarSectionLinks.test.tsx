import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Navbar, { navLinks } from "@/components/landing/Navbar";
import Home from "@/app/page";

describe("Landing Navigation Section Links", () => {
  it("declares links for every section id rendered on the landing page", () => {
    const expectedHrefs = ["#features", "#how-it-works", "#stellar", "#community", "#faq"];
    const declaredHrefs = navLinks.map((l) => l.href);

    expect(declaredHrefs).toEqual(expectedHrefs);
  });

  it("renders identical navigation links in both desktop and mobile menus", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // In desktop view, all navLinks are rendered
    navLinks.forEach(({ label }) => {
      const desktopLinks = screen.getAllByRole("link", { name: label });
      expect(desktopLinks.length).toBeGreaterThanOrEqual(1);
    });

    // Open mobile menu
    const toggle = screen.getByRole("button", { name: /open navigation/i });
    await user.click(toggle);

    // Both desktop and mobile now contain the full set
    navLinks.forEach(({ label }) => {
      const links = screen.getAllByRole("link", { name: label });
      expect(links.length).toBe(2); // One desktop, one mobile
    });
  });

  it("ensures every section rendered on Home has a matching navLink and accounts for header offset with scroll-mt", () => {
    const { container } = render(<Home />);

    const sectionsWithId = container.querySelectorAll("section[id]");
    expect(sectionsWithId.length).toBe(5);

    const sectionIds = Array.from(sectionsWithId).map((s) => `#${s.id}`);
    expect(sectionIds).toEqual(["#features", "#how-it-works", "#stellar", "#community", "#faq"]);

    // Every section with an id must account for header offset
    sectionsWithId.forEach((section) => {
      expect(section.className).toContain("scroll-mt-24");
    });
  });
});
