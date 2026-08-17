import type { DetectedActivity, ParseResult } from "@/types/activity";

const MAX_INPUT_LENGTH = 2000;

export interface ActivityParser {
  parse(text: string): ParseResult;
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function extractBusDistance(text: string): number | null {
  const patterns = [
    /(\d+(?:[.,]\d+)?)\s*(?:km|kilómetros|kilometros|kilómetro|kilometro)/i,
    /(?:viaj[eé]|recorr[ií]|fui)\s*(?:\w+\s+){0,6}?(\d+(?:[.,]\d+)?)\s*(?:km|kilómetros|kilometros)?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const distance = parseFloat(match[1].replace(",", "."));
      if (!Number.isNaN(distance) && distance > 0) {
        return distance;
      }
    }
  }

  return null;
}

function mentionsBus(text: string): boolean {
  return /\b(bus|autobús|autobus|colectivo)\b/i.test(text);
}

function mentionsMeat(text: string): boolean {
  return /\b(com[ií]|consum[ií]|comer)\b.*\b(carne|res|pollo|cerdo|vacuno)\b|\b(carne)\b/i.test(
    text,
  );
}

function extractMeatQuantityKg(text: string): number | null {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos|kilogramos|g|gramos)\b/i);
  if (!match?.[1]) {
    return null;
  }

  const value = parseFloat(match[1].replace(",", "."));
  if (Number.isNaN(value) || value <= 0) {
    return null;
  }

  const unit = match[0].toLowerCase();
  if (unit.includes("g") && !unit.includes("kg")) {
    return value / 1000;
  }

  return value;
}

export class LocalActivityParser implements ActivityParser {
  parse(rawText: string): ParseResult {
    const text = normalizeText(rawText);
    const warnings: string[] = [];
    const activities: DetectedActivity[] = [];

    if (!text) {
      return { activities, warnings: ["La descripción está vacía."] };
    }

    if (text.length > MAX_INPUT_LENGTH) {
      return {
        activities: [],
        warnings: [`La descripción supera el límite de ${MAX_INPUT_LENGTH} caracteres.`],
      };
    }

    if (mentionsBus(text)) {
      const distanceKm = extractBusDistance(text);
      if (distanceKm !== null) {
        activities.push({
          category: "transport",
          mode: "bus",
          distanceKm,
          label: `Viaje en bus (${distanceKm} km)`,
        });
      } else {
        warnings.push(
          "Se detectó transporte en bus, pero no se encontró una distancia válida en km.",
        );
      }
    }

    if (mentionsMeat(text)) {
      const estimatedKg = extractMeatQuantityKg(text);
      activities.push({
        category: "food",
        type: "meat",
        estimatedKg: estimatedKg ?? 0.2,
        label:
          estimatedKg !== null
            ? `Consumo de carne (${estimatedKg} kg)`
            : "Consumo de carne (porción estimada)",
      });
    }

    if (activities.length === 0 && warnings.length === 0) {
      warnings.push(
        "No se detectaron actividades compatibles. Prueba con transporte en bus o consumo de carne.",
      );
    }

    return { activities, warnings };
  }
}

export const activityParser: ActivityParser = new LocalActivityParser();
