/* @vitest-environment node */

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getGearByIdMock, updateGearImageURLMock, uploadGeneratedImageMock, generateContentMock } =
  vi.hoisted(() => {
    return {
      getGearByIdMock: vi.fn(),
      updateGearImageURLMock: vi.fn(),
      uploadGeneratedImageMock: vi.fn(),
      generateContentMock: vi.fn(),
    };
  });

vi.mock("@/services/inventoryService", () => ({
  getGearById: getGearByIdMock,
  updateGearImageURL: updateGearImageURLMock,
}));

vi.mock("@/services/storageService", () => ({
  uploadGeneratedImage: uploadGeneratedImageMock,
}));

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: generateContentMock,
      };
    }
  },
}));

describe("imageService", () => {
  beforeEach(() => {
    getGearByIdMock.mockReset();
    updateGearImageURLMock.mockReset();
    uploadGeneratedImageMock.mockReset();
    generateContentMock.mockReset();
  });

  it("falls back to Nano Banana and persists to GCS when imageURL returns 404", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({ ok: false, status: 404 });

    getGearByIdMock.mockResolvedValue({
      id: "gear-404",
      name: "Tabla Pro",
      shortDescription: "Tabla para olas grandes.",
      imageURL: "https://source.unsplash.com/featured/?broken-image",
    });

    generateContentMock.mockResolvedValue({
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    data: Buffer.from("fake-image-content").toString("base64"),
                    mimeType: "image/png",
                  },
                },
              ],
            },
          },
        ],
      },
    });

    uploadGeneratedImageMock.mockResolvedValue(
      "https://storage.googleapis.com/rent-my-gear-demo/nano-banana/gear-404/abc.png",
    );

    const { resolveGearImageURL } = await import("@/services/imageService");
    const result = await resolveGearImageURL("gear-404");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://source.unsplash.com/featured/?broken-image",
      {
        method: "HEAD",
        cache: "no-store",
      },
    );
    expect(generateContentMock).toHaveBeenCalledTimes(1);
    expect(uploadGeneratedImageMock).toHaveBeenCalledTimes(1);
    expect(updateGearImageURLMock).toHaveBeenCalledTimes(1);
    expect(result.source).toBe("nano-banana");
    expect(result.imageURL).toContain("storage.googleapis.com");

    vi.unstubAllGlobals();
  });
});
