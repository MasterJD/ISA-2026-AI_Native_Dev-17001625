import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/config/env";
import { getGearById, updateGearImageURL } from "@/services/inventoryService";
import { uploadGeneratedImage } from "@/services/storageService";

type ImageSource = "existing" | "nano-banana";

export interface ResolvedImage {
  imageURL: string;
  source: ImageSource;
}

interface GeneratedImagePayload {
  data: Buffer;
  mimeType: string;
}

function buildPrompt(gearName: string, description: string): string {
  return [
    "Create a premium commercial photograph for a rental marketplace.",
    `Subject: ${gearName}.`,
    `Context: ${description}.`,
    "Style: crisp product lighting, realistic textures, high-end editorial look, neutral background.",
    "Aspect ratio: 16:9.",
  ].join(" ");
}

function createEmergencySvg(gearName: string): GeneratedImagePayload {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#edf2ff" />
      <stop offset="100%" stop-color="#c7d2fe" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="64" font-family="Arial, sans-serif" fill="#1f2937">
    ${gearName}
  </text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" fill="#374151">
    Generated Placeholder
  </text>
</svg>`;

  return {
    data: Buffer.from(svg, "utf-8"),
    mimeType: "image/svg+xml",
  };
}

async function generateImageWithNanoBanana(
  prompt: string,
  gearName: string,
): Promise<GeneratedImagePayload> {
  const client = new GoogleGenerativeAI(env.NANO_BANANA_API_KEY);
  const model = client.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

  try {
    const result = await model.generateContent(prompt);
    const parts = result.response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData?.data && part.inlineData.mimeType) {
        return {
          data: Buffer.from(part.inlineData.data, "base64"),
          mimeType: part.inlineData.mimeType,
        };
      }
    }
  } catch {
    return createEmergencySvg(gearName);
  }

  return createEmergencySvg(gearName);
}

async function verifyRemoteImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function resolveGearImageURL(gearId: string): Promise<ResolvedImage> {
  const gear = await getGearById(gearId);

  if (!gear) {
    throw new Error(`Gear item ${gearId} not found`);
  }

  if (gear.imageURL) {
    const existingReachable = await verifyRemoteImage(gear.imageURL);

    if (existingReachable) {
      return {
        imageURL: gear.imageURL,
        source: "existing",
      };
    }
  }

  const prompt = buildPrompt(gear.name, gear.shortDescription);
  const generated = await generateImageWithNanoBanana(prompt, gear.name);

  const extension = generated.mimeType.includes("svg")
    ? "svg"
    : generated.mimeType.includes("png")
      ? "png"
      : "jpg";

  const objectPath = `nano-banana/${gear.id}/${Date.now()}.${extension}`;
  const gcsURL = await uploadGeneratedImage(
    objectPath,
    generated.data,
    generated.mimeType,
  );

  await updateGearImageURL(gear.id, gcsURL);

  return {
    imageURL: gcsURL,
    source: "nano-banana",
  };
}
