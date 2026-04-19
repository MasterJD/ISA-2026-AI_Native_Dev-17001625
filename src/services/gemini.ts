import "server-only";

import type { TravelPlan } from "@/types/travel";

export type { TravelPlan } from "@/types/travel";

function buildFallbackPlan(destination: string, context?: string): TravelPlan {
  const contextText = context?.trim();

  return {
    intro: contextText
      ? `Your trip to ${destination} is tuned for ${contextText}.`
      : `Your trip to ${destination} combines landmarks, local rhythm, and practical pacing.`,
    days: [
      {
        day: 1,
        title: "Arrival and city orientation",
        activities: [
          "Check in and explore the neighborhood on foot.",
          "Visit a signature landmark during golden hour.",
          "Dinner at a local bistro with regional specialties.",
        ],
      },
      {
        day: 2,
        title: "Culture and neighborhoods",
        activities: [
          "Start with a market or museum near the historic center.",
          "Move to a less-touristy district for lunch and cafes.",
          "Close with a scenic viewpoint at sunset.",
        ],
      },
      {
        day: 3,
        title: "Slow day and departure",
        activities: [
          "Choose one meaningful revisit from previous days.",
          "Pick up handcrafted gifts from local artisans.",
          "Enjoy an early meal before heading to transit.",
        ],
      },
    ],
    hiddenGem: {
      title: "Local favorite walk",
      description:
        "Follow a quiet street-to-waterfront route early in the morning for authentic daily city life.",
    },
    localFood: {
      dish: "House specialty tasting",
      description:
        "Ask for the seasonal plate and pair it with a non-tourist beverage recommendation from staff.",
    },
  };
}

export async function generateTravelPlan(
  destination: string,
  context?: string,
): Promise<TravelPlan> {
  const normalizedDestination = destination.trim();

  if (!normalizedDestination) {
    throw new Error("destination is required");
  }

  return buildFallbackPlan(normalizedDestination, context);
}
