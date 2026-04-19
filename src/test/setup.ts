import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

process.env.GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME ?? "rent-my-gear-demo";
process.env.GCS_PROJECT_ID = process.env.GCS_PROJECT_ID ?? "rentmygear1";
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "C:/tmp/service-account.json";
process.env.NANO_BANANA_API_KEY =
  process.env.NANO_BANANA_API_KEY ?? "test-api-key-123456789";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", {
      ...props,
      src: typeof props.src === "string" ? props.src : "",
      alt: props.alt ?? "",
    }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    React.createElement(
      "a",
      {
        href: typeof href === "string" ? href : "",
        ...props,
      },
      children,
    ),
}));

vi.mock("server-only", () => ({}));
