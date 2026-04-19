"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface GearImageProps {
  gearId: string;
  gearName: string;
  initialImageURL: string | null;
  className?: string;
}

interface ResolveResponse {
  imageURL: string;
}

export function GearImage({
  gearId,
  gearName,
  initialImageURL,
  className,
}: GearImageProps) {
  const [imageURL, setImageURL] = useState<string | null>(initialImageURL);
  const [isResolving, setIsResolving] = useState<boolean>(!initialImageURL);
  const [hasResolvedOnce, setHasResolvedOnce] = useState<boolean>(false);

  const resolveMissingImage = useCallback(async () => {
    if (hasResolvedOnce) {
      return;
    }

    setHasResolvedOnce(true);
    setIsResolving(true);

    try {
      const response = await fetch("/api/images/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gearId }),
      });

      if (!response.ok) {
        throw new Error("Image resolution failed");
      }

      const payload = (await response.json()) as ResolveResponse;
      setImageURL(payload.imageURL);
    } catch {
      setImageURL(null);
    } finally {
      setIsResolving(false);
    }
  }, [gearId, hasResolvedOnce]);

  useEffect(() => {
    if (!imageURL) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void resolveMissingImage();
    }
  }, [imageURL, resolveMissingImage]);

  if (!imageURL) {
    return (
      <div
        className={cn(
          "relative h-52 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200",
          className,
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="max-w-[18ch] text-center text-sm text-slate-500">
            {isResolving
              ? "Generando imagen premium..."
              : "Imagen no disponible temporalmente"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-52 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",
        className,
      )}
    >
      <Image
        src={imageURL}
        alt={gearName}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        onError={() => {
          setImageURL(null);
          setHasResolvedOnce(false);
        }}
      />
    </div>
  );
}
