export interface Destination {
  id: string;
  slug: string;
  title: string;
  description: string;
  gridTitle: string;
  gridSubtitle: string;
  cityName?: string;
  location?: string;
  tags: string[];
  urls: {
    thumb: string;
    small: string;
    regular: string;
  };
  user: {
    name: string;
    username: string;
  };
}

export interface TravelPlanDay {
  day: number;
  title: string;
  activities: string[];
}

export interface TravelPlan {
  intro: string;
  days: TravelPlanDay[];
  hiddenGem: {
    title: string;
    description: string;
  };
  localFood: {
    dish: string;
    description: string;
  };
}
