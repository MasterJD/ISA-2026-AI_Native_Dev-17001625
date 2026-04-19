import "server-only";

import { MOCK_DESTINATIONS } from "@/lib/mock-data";
import type { Destination } from "@/types/travel";

export type DestinationMode = "home" | "search";

export type { Destination } from "@/types/travel";

interface UnsplashPhoto {
  id: string;
  slug: string;
  description: string | null;
  alt_description: string | null;
  alternative_slugs?: {
    es?: string;
  };
  urls: {
    thumb: string;
    small: string;
    regular: string;
  };
  tags?: Array<{
    title: string;
  }>;
  location?: {
    city?: string | null;
    name?: string | null;
  };
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

const TOP_TOURIST_CITIES = [
  "Paris",
  "Tokyo",
  "Rome",
  "Barcelona",
  "New York",
  "London",
  "Dubai",
  "Singapore",
  "Istanbul",
  "Bangkok",
  "Prague",
  "Vienna",
  "Amsterdam",
  "Lisbon",
  "Seoul",
  "Kyoto",
  "Hong Kong",
  "Marrakech",
  "Cape Town",
  "Sydney",
  "Auckland",
  "Vancouver",
  "San Francisco",
  "Los Angeles",
  "Rio de Janeiro",
  "Buenos Aires",
  "Mexico City",
  "Cairo",
  "Athens",
  "Bali",
];

function hasUnsplashAccessKey(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY?.trim());
}

function formatMockDestination(
  destination: Destination,
  mode: DestinationMode,
): Destination {
  const searchSubtitle =
    destination.tags.slice(0, 3).join(" • ") || destination.gridSubtitle;

  return {
    ...destination,
    gridTitle:
      mode === "home"
        ? destination.cityName || destination.gridTitle
        : destination.description || destination.gridTitle,
    gridSubtitle: mode === "home" ? destination.description : searchSubtitle,
  };
}

function getMockDestinations(mode: DestinationMode, query = ""): Destination[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredDestinations = normalizedQuery
    ? MOCK_DESTINATIONS.filter((destination) => {
        const searchableText = [
          destination.title,
          destination.description,
          destination.cityName,
          destination.location,
          ...destination.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : MOCK_DESTINATIONS;

  return filteredDestinations.map((destination) =>
    formatMockDestination(destination, mode),
  );
}

function requireUnsplashAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured.");
  }

  return key;
}

function pickRandomCities(count: number): string[] {
  const pool = [...TOP_TOURIST_CITIES];
  const selected: string[] = [];

  while (pool.length > 0 && selected.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    const [city] = pool.splice(index, 1);
    selected.push(city);
  }

  return selected;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripKnownPhotoId(value: string, photoId: string): string {
  if (!value) {
    return "";
  }

  return value.replace(new RegExp(escapeRegex(photoId), "gi"), " ").trim();
}

function cleanText(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/^\/?es\//i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\.[a-z0-9]{2,4}$/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeCityTitle(value: string): string {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
    return parts[0];
  }

  return parts.join(", ");
}

function getPhotoDescription(photo: UnsplashPhoto): string {
  return (
    cleanText(photo.description) ||
    cleanText(photo.alt_description) ||
    cleanText(photo.alternative_slugs?.es) ||
    "Travel destination"
  );
}

function getPhotoTags(photo: UnsplashPhoto): string[] {
  return (photo.tags ?? [])
    .map((tag) => cleanText(tag.title))
    .filter(Boolean)
    .slice(0, 8);
}

function mapPhoto(
  photo: UnsplashPhoto,
  mode: DestinationMode,
  contextCity?: string,
): Destination {
  const cityName = dedupeCityTitle(
    cleanText(photo.location?.city) || cleanText(contextCity),
  );

  const locationName = cleanText(photo.location?.name);
  const photoDescription = stripKnownPhotoId(getPhotoDescription(photo), photo.id);
  const tags = getPhotoTags(photo);

  const gridTitle =
    mode === "home"
      ? cityName || photoDescription || "Travel destination"
      : photoDescription || cityName || "Travel destination";

  const gridSubtitle =
    mode === "home"
      ? photoDescription || locationName || "Discover this place"
      : tags.slice(0, 3).join(" • ") || locationName || cityName || "Travel";

  return {
    id: photo.id,
    slug: cleanText(photo.slug) || photo.id,
    title: gridTitle,
    description: stripKnownPhotoId(gridSubtitle, photo.id),
    gridTitle,
    gridSubtitle,
    cityName: cityName || undefined,
    location: locationName || undefined,
    tags,
    urls: {
      thumb: photo.urls.thumb,
      small: photo.urls.small,
      regular: photo.urls.regular,
    },
    user: {
      name: cleanText(photo.user?.name) || "Unsplash",
      username: cleanText(photo.user?.username) || "unsplash",
    },
  };
}

async function requestSearchPhotos(
  query: string,
  perPage: number,
  mode: DestinationMode,
  contextCity?: string,
): Promise<Destination[]> {
  const key = requireUnsplashAccessKey();
  const url = new URL(`${UNSPLASH_BASE_URL}/search/photos`);

  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(1 + Math.floor(Math.random() * 2)));
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unsplash search failed: ${response.status}`);
  }

  const payload = (await response.json()) as UnsplashSearchResponse;

  return payload.results.map((photo) => mapPhoto(photo, mode, contextCity));
}

function dedupeById(destinations: Destination[]): Destination[] {
  const seen = new Set<string>();

  return destinations.filter((destination) => {
    if (seen.has(destination.id)) {
      return false;
    }

    seen.add(destination.id);
    return true;
  });
}

export async function fetchPopular(): Promise<Destination[]> {
  if (!hasUnsplashAccessKey()) {
    return getMockDestinations("home").slice(0, 24);
  }

  const selectedCities = pickRandomCities(3);
  const batches = await Promise.all(
    selectedCities.map((city) =>
      requestSearchPhotos(`${city} travel`, 10, "home", city),
    ),
  );

  return dedupeById(batches.flat()).slice(0, 24);
}

export async function searchDestinations(query: string): Promise<Destination[]> {
  const normalizedQuery = query.trim();

  if (!hasUnsplashAccessKey()) {
    return getMockDestinations("search", normalizedQuery).slice(0, 24);
  }

  if (!normalizedQuery) {
    return fetchPopular();
  }

  return requestSearchPhotos(`${normalizedQuery} travel`, 24, "search");
}

export async function fetchRelated(
  location: string,
  tags: string[],
  excludedId?: string,
  fallbackCity?: string,
): Promise<Destination[]> {
  if (!hasUnsplashAccessKey()) {
    const primaryQuery = [location, ...tags.slice(0, 3)].join(" ").trim();

    let merged = dedupeById(getMockDestinations("search", primaryQuery));

    if (merged.length < 8) {
      const secondaryQuery =
        `${fallbackCity || location || "world"} landmark travel`.trim();

      merged = dedupeById([
        ...merged,
        ...getMockDestinations("search", secondaryQuery),
        ...getMockDestinations("search"),
      ]);
    }

    return merged
      .filter((destination) => destination.id !== excludedId)
      .slice(0, 8);
  }

  const firstTags = tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  const primaryQuery = [location, firstTags].filter(Boolean).join(" ").trim();
  const primary = await requestSearchPhotos(
    primaryQuery || `${fallbackCity || "travel"} travel`,
    12,
    "search",
    fallbackCity || location,
  );

  let merged = dedupeById(primary);

  if (merged.length < 8) {
    const secondary = await requestSearchPhotos(
      `${fallbackCity || location || "world"} landmark travel`,
      12,
      "search",
      fallbackCity || location,
    );

    merged = dedupeById([...merged, ...secondary]);
  }

  return merged
    .filter((destination) => destination.id !== excludedId)
    .slice(0, 8);
}

export async function fetchById(id: string): Promise<Destination | null> {
  if (!hasUnsplashAccessKey()) {
    return getMockDestinations("search").find((item) => item.id === id) || null;
  }

  const key = requireUnsplashAccessKey();
  const url = new URL(`${UNSPLASH_BASE_URL}/photos/${encodeURIComponent(id)}`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Unsplash photo lookup failed: ${response.status}`);
  }

  const photo = (await response.json()) as UnsplashPhoto;
  return mapPhoto(photo, "search");
}
