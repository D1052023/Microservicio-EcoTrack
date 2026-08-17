import { describe, expect, it } from "vitest";
import { calculateEmissions } from "@/services/emissions/emission-calculator";
import { analyzeUserActivities } from "@/services/ecotrack-service";
import { EMISSION_FACTORS } from "@/constants/emission-factors";
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

  it("calcula total consistente para múltiples actividades del mismo tipo", () => {
    const input =
      "Hoy desayuné carne, viajé 15 km en bus, regresé 10 km en bus y comí carne en la noche";
    const { parseResult, emissionResult } = analyzeUserActivities({ text: input });

    expect(parseResult.activities).toHaveLength(4);
    expect(emissionResult).not.toBeNull();

    const expectedTotal =
      (15 + 10) * EMISSION_FACTORS.transport.bus +
      2 * EMISSION_FACTORS.food.defaultMeatPortionKg * EMISSION_FACTORS.food.meat;

    expect(emissionResult?.totalCo2Kg).toBeCloseTo(expectedTotal, 3);
    expect(emissionResult?.activities).toHaveLength(4);
  });

  it("no calcula emisiones cuando la distancia en bus es negativa", () => {
    const { parseResult, emissionResult } = analyzeUserActivities({
      text: "Hoy viajé -20 km en bus",
    });

    expect(parseResult.activities).toHaveLength(0);
    expect(emissionResult).toBeNull();
  });

  it("calcula emisiones correctamente para 20 km en bus", () => {
    const { parseResult, emissionResult } = analyzeUserActivities({
      text: "Hoy viajé 20 km en bus",
    });

    expect(parseResult.activities).toHaveLength(1);
    expect(emissionResult?.totalCo2Kg).toBeCloseTo(20 * EMISSION_FACTORS.transport.bus, 5);
  });
});
