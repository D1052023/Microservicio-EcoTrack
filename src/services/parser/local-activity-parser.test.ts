import { describe, expect, it } from "vitest";
import { LocalActivityParser } from "@/services/parser/local-activity-parser";

describe("LocalActivityParser", () => {
  const parser = new LocalActivityParser();

  it("detecta transporte en bus con distancia en km", () => {
    const result = parser.parse("Hoy viajé 20 km en bus");

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]).toMatchObject({
      category: "transport",
      mode: "bus",
      distanceKm: 20,
    });
  });

  it("detecta consumo de carne con porción por defecto", () => {
    const result = parser.parse("Hoy comí carne");

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]).toMatchObject({
      category: "food",
      type: "meat",
      estimatedKg: 0.2,
    });
  });

  it("detecta múltiples actividades en una sola descripción", () => {
    const result = parser.parse("Hoy comí carne y viajé 20 km en bus");

    expect(result.activities).toHaveLength(2);
  });

  it("devuelve advertencia cuando el texto está vacío", () => {
    const result = parser.parse("   ");

    expect(result.activities).toHaveLength(0);
    expect(result.warnings[0]).toContain("vacía");
  });
});
