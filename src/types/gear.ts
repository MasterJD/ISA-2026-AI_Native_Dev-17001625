export type CategoryId =
  | "fotografia-video"
  | "montana-camping"
  | "deportes-acuaticos";

export interface GearAvailability {
  inStock: boolean;
  totalUnits: number;
}

export type GearTechnicalSpecs = Record<string, string>;

export interface GearItem {
  id: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  shortDescription: string;
  dailyRate: number;
  currency: "USD";
  imageURL: string | null;
  technicalSpecs: GearTechnicalSpecs;
  availability: GearAvailability;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  description: string;
}