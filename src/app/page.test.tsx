/* eslint-disable @next/next/no-img-element */

import { render, screen } from "@testing-library/react";
import { forwardRef, type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      {...props}
    />
  ),
}));

vi.mock("next/link", () => {
  const MockLink = forwardRef<
    HTMLAnchorElement,
    AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >(({ href, children, ...props }, ref) => (
    <a ref={ref} href={href} {...props}>
      {children}
    </a>
  ));

  MockLink.displayName = "MockLink";

  return {
    default: MockLink,
  };
});

describe("home page", () => {
  it("renders core UI in isolation without app-router context", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /explora destinos y crea planes inteligentes/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", {
        name: /buscar destinos/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /itinerario ia/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });
});
