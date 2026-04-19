import inventoryJson from "@/data/inventory.json";
import type { CategoryDefinition, CategoryId, GearItem } from "@/types/gear";

const categoryDefinitions: CategoryDefinition[] = [
  {
    id: "fotografia-video",
    name: "Fotografía y Video",
    description: "Cámaras, lentes y accesorios para contenido profesional.",
  },
  {
    id: "montana-camping",
    name: "Montaña y Camping",
    description: "Equipo de aventura para rutas, cumbres y campamentos.",
  },
  {
    id: "deportes-acuaticos",
    name: "Deportes Acuáticos",
    description: "Tablas, neoprenos y accesorios para aventuras en agua.",
  },
];

const inventoryStore = structuredClone(inventoryJson) as GearItem[];
const imageOverrides = new Map<string, string>();

function withOverrides(item: GearItem): GearItem {
  const override = imageOverrides.get(item.id);

  if (!override) {
    return item;
  }

  return {
    ...item,
    imageURL: override,
  };
}

export async function getAllInventory(): Promise<GearItem[]> {
  return inventoryStore.map(withOverrides);
}

export async function getCategories(): Promise<CategoryDefinition[]> {
  return categoryDefinitions;
}

export async function getCategoryById(
  categoryId: string,
): Promise<CategoryDefinition | null> {
  return categoryDefinitions.find((category) => category.id === categoryId) ?? null;
}

export async function getInventoryByCategory(
  categoryId: CategoryId,
): Promise<GearItem[]> {
  return inventoryStore.filter((item) => item.categoryId === categoryId).map(withOverrides);
}

export async function getGearById(gearId: string): Promise<GearItem | null> {
  const item = inventoryStore.find((gear) => gear.id === gearId);

  if (!item) {
    return null;
  }

  return withOverrides(item);
}

export async function searchInventory(
  categoryId: CategoryId,
  query: string,
): Promise<GearItem[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const scopedItems = await getInventoryByCategory(categoryId);

  if (!normalizedQuery) {
    return scopedItems;
  }

  return scopedItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.shortDescription.toLowerCase().includes(normalizedQuery)
    );
  });
}

export async function updateGearImageURL(
  gearId: string,
  imageURL: string,
): Promise<GearItem | null> {
  const existing = inventoryStore.find((item) => item.id === gearId);

  if (!existing) {
    return null;
  }

  imageOverrides.set(gearId, imageURL);
  existing.imageURL = imageURL;

  return withOverrides(existing);
}

export async function getRandomFeaturedItems(limit = 5): Promise<GearItem[]> {
  const copy = [...inventoryStore].map(withOverrides);

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy.slice(0, Math.max(1, limit));
}
