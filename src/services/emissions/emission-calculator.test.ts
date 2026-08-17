import { describe, expect, it } from "vitest";
import { calculateEmissions } from "@/services/emissions/emission-calculator";
import type { DetectedActivity } from "@/types/activity";

describe("calculateEmissions", () => {
  it("calcula emisiones para bus y carne", () => {
    const activities: DetectedActivity[] = [
      {
        category: "transport",
        mode: "bus",
        distanceKm: 20,
        label: "Viaje en bus (20 km)",
      },
      {
        category: "food",
        type: "meat",
        estimatedKg: 0.2,
        label: "Consumo de carne (porción estimada)",
      },
    ];

    const result = calculateEmissions(activities);

    expect(result.activities).toHaveLength(2);
    expect(result.totalCo2Kg).toBeCloseTo(20 * 0.089 + 0.2 * 27, 5);
  });
});
