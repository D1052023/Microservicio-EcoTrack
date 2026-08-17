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

  it("detecta múltiples viajes en bus y consumos de carne en una entrada", () => {
    const input =
      "Hoy desayuné carne, viajé 15 km en bus, regresé 10 km en bus y comí carne en la noche";
    const result = parser.parse(input);

    expect(result.activities).toHaveLength(4);

    const busTrips = result.activities.filter((a) => a.category === "transport");
    const meatMeals = result.activities.filter((a) => a.category === "food");

    expect(busTrips).toHaveLength(2);
    expect(meatMeals).toHaveLength(2);
    expect(busTrips.map((trip) => trip.distanceKm)).toEqual([15, 10]);
    expect(meatMeals.every((meal) => meal.estimatedKg === 0.2)).toBe(true);
  });

  it("detecta una sola actividad de carne", () => {
    const result = parser.parse("Hoy comí carne");

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]).toMatchObject({
      category: "food",
      type: "meat",
      estimatedKg: 0.2,
    });
  });

  it("detecta una sola actividad de bus", () => {
    const result = parser.parse("Hoy viajé 20 km en bus");

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]).toMatchObject({
      category: "transport",
      mode: "bus",
      distanceKm: 20,
    });
  });

  it("rechaza distancias negativas sin calcular actividad de bus", () => {
    const result = parser.parse("Hoy viajé -20 km en bus");

    expect(result.activities).toHaveLength(0);
    expect(result.warnings[0]).toBe("La distancia debe ser mayor que cero.");
  });

  it("rechaza distancia cero sin calcular actividad de bus", () => {
    const result = parser.parse("Hoy viajé 0 km en bus");

    expect(result.activities).toHaveLength(0);
    expect(result.warnings[0]).toBe("La distancia debe ser mayor que cero.");
  });
});
