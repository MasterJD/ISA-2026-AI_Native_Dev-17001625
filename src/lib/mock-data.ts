import type { Destination } from "@/types/travel";

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "mock-paris",
    slug: "paris-francia",
    title: "Paris",
    description: "Calles clasicas y vistas iconicas del Sena",
    gridTitle: "Paris",
    gridSubtitle: "Calles clasicas y vistas iconicas del Sena",
    cityName: "Paris",
    location: "Paris",
    tags: ["romance", "city", "travel", "architecture"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-tokyo",
    slug: "tokyo-japon",
    title: "Tokyo",
    description: "Neones, templos y vida urbana vibrante",
    gridTitle: "Tokyo",
    gridSubtitle: "Neones, templos y vida urbana vibrante",
    cityName: "Tokyo",
    location: "Tokyo",
    tags: ["city", "night", "culture", "travel"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-rome",
    slug: "rome-italia",
    title: "Rome",
    description: "Historia antigua entre plazas y trattorias",
    gridTitle: "Rome",
    gridSubtitle: "Historia antigua entre plazas y trattorias",
    cityName: "Rome",
    location: "Rome",
    tags: ["history", "food", "travel", "architecture"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-barcelona",
    slug: "barcelona-espana",
    title: "Barcelona",
    description: "Gaudi, mar mediterraneo y barrios creativos",
    gridTitle: "Barcelona",
    gridSubtitle: "Gaudi, mar mediterraneo y barrios creativos",
    cityName: "Barcelona",
    location: "Barcelona",
    tags: ["beach", "city", "art", "travel"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-london",
    slug: "london-reino-unido",
    title: "London",
    description: "Museos, parques y arquitectura victoriana",
    gridTitle: "London",
    gridSubtitle: "Museos, parques y arquitectura victoriana",
    cityName: "London",
    location: "London",
    tags: ["city", "culture", "travel", "museum"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-new-york",
    slug: "new-york-usa",
    title: "New York",
    description: "Skyline, parques y barrios con personalidad",
    gridTitle: "New York",
    gridSubtitle: "Skyline, parques y barrios con personalidad",
    cityName: "New York",
    location: "New York",
    tags: ["city", "skyline", "travel", "urban"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-sydney",
    slug: "sydney-australia",
    title: "Sydney",
    description: "Bahia abierta y energia costera",
    gridTitle: "Sydney",
    gridSubtitle: "Bahia abierta y energia costera",
    cityName: "Sydney",
    location: "Sydney",
    tags: ["harbor", "beach", "travel", "landmark"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-cape-town",
    slug: "cape-town-sudafrica",
    title: "Cape Town",
    description: "Montana, oceano y contrastes naturales",
    gridTitle: "Cape Town",
    gridSubtitle: "Montana, oceano y contrastes naturales",
    cityName: "Cape Town",
    location: "Cape Town",
    tags: ["nature", "coast", "travel", "adventure"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-dubai",
    slug: "dubai-emiratos",
    title: "Dubai",
    description: "Rascacielos, desierto y experiencias premium",
    gridTitle: "Dubai",
    gridSubtitle: "Rascacielos, desierto y experiencias premium",
    cityName: "Dubai",
    location: "Dubai",
    tags: ["luxury", "city", "travel", "desert"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-marrakech",
    slug: "marrakech-marruecos",
    title: "Marrakech",
    description: "Mercados, colores y arquitectura tradicional",
    gridTitle: "Marrakech",
    gridSubtitle: "Mercados, colores y arquitectura tradicional",
    cityName: "Marrakech",
    location: "Marrakech",
    tags: ["culture", "market", "travel", "history"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1597212720400-bf1d8f16d3f1?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1597212720400-bf1d8f16d3f1?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1597212720400-bf1d8f16d3f1?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-vienna",
    slug: "vienna-austria",
    title: "Vienna",
    description: "Cafes historicos y musica clasica en cada plaza",
    gridTitle: "Vienna",
    gridSubtitle: "Cafes historicos y musica clasica en cada plaza",
    cityName: "Vienna",
    location: "Vienna",
    tags: ["culture", "city", "music", "travel"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
  {
    id: "mock-athens",
    slug: "athens-grecia",
    title: "Athens",
    description: "Ruinas clasicas con atardeceres dorados",
    gridTitle: "Athens",
    gridSubtitle: "Ruinas clasicas con atardeceres dorados",
    cityName: "Athens",
    location: "Athens",
    tags: ["history", "sunset", "travel", "landmark"],
    urls: {
      thumb:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=320&q=60",
      small:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=900&q=75",
      regular:
        "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=80",
    },
    user: { name: "Unsplash", username: "unsplash" },
  },
];
