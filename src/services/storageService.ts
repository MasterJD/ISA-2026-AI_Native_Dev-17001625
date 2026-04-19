import "server-only";

import { Storage } from "@google-cloud/storage";

import { env } from "@/config/env";

const storage = new Storage({
  projectId: env.GCS_PROJECT_ID,
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(env.GCS_BUCKET_NAME);

export function buildPublicUrl(objectName: string): string {
  const encodedPath = objectName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://storage.googleapis.com/${env.GCS_BUCKET_NAME}/${encodedPath}`;
}

export async function uploadGeneratedImage(
  objectName: string,
  data: Buffer,
  mimeType: string,
): Promise<string> {
  const targetFile = bucket.file(objectName);

  await targetFile.save(data, {
    resumable: false,
    contentType: mimeType,
    metadata: {
      cacheControl: "public, max-age=86400",
    },
  });

  await targetFile.makePublic();

  return buildPublicUrl(objectName);
}

export async function downloadGeneratedImage(
  objectName: string,
): Promise<Buffer | null> {
  const targetFile = bucket.file(objectName);
  const [exists] = await targetFile.exists();

  if (!exists) {
    return null;
  }

  const [content] = await targetFile.download();
  return content;
}
