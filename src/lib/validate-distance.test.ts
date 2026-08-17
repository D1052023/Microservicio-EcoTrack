import { describe, expect, it } from "vitest";
import {
  DISTANCE_MUST_BE_POSITIVE_MESSAGE,
  validateDistanceKm,
} from "@/lib/validate-distance";

describe("validateDistanceKm", () => {
  it("rechaza distancias negativas", () => {
    const result = validateDistanceKm("-20");

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.message).toBe(DISTANCE_MUST_BE_POSITIVE_MESSAGE);
    }
  });

  it("rechaza distancia cero", () => {
    const result = validateDistanceKm("0");

    expect(result.status).toBe("invalid");
  });

  it("acepta distancias positivas", () => {
    const result = validateDistanceKm("20");

    expect(result).toEqual({ status: "valid", distanceKm: 20 });
  });
});
