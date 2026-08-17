import type { DetectedActivity, ParseResult } from "@/types/activity";
import {
  DISTANCE_MUST_BE_POSITIVE_MESSAGE,
  validateDistanceKm,
} from "@/lib/validate-distance";

const MAX_INPUT_LENGTH = 2000;

export interface ActivityParser {
  parse(text: string): ParseResult;
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function splitIntoSegments(text: string): string[] {
  return text
    .split(/[,;]|\s+y\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function extractBusDistance(segment: string): {
  distanceKm: number | null;
  hasInvalidDistance: boolean;
} {
  const patterns = [
    /(-?\d+(?:[.,]\d+)?)\s*(?:km|kilómetros|kilometros|kilómetro|kilometro)/i,
    /(?:viaj[eé]|regres[eé]|volv[ií]|recorr[ií]|fui)\s*(?:\w+\s+){0,6}?(-?\d+(?:[.,]\d+)?)\s*(?:km|kilómetros|kilometros)?/i,
  ];

  for (const pattern of patterns) {
    const match = segment.match(pattern);
    if (match?.[1]) {
      const validation = validateDistanceKm(match[1]);
      if (validation.status === "valid") {
        return { distanceKm: validation.distanceKm, hasInvalidDistance: false };
      }
      if (validation.status === "invalid") {
        return { distanceKm: null, hasInvalidDistance: true };
      }
    }
  }

  return { distanceKm: null, hasInvalidDistance: false };
}

function mentionsBus(segment: string): boolean {
  return /\b(bus|autobús|autobus|colectivo)\b/i.test(segment);
}

const EATING_VERB_PATTERN =
  /(?:desayun(?:e|é)|almorc(?:e|é)|cen(?:e|é)|com(?:i|í)|consum(?:i|í)|comer)(?=\s|$|[,.])/i;

function mentionsMeat(segment: string): boolean {
  const hasMeat = /\b(carne|res|pollo|cerdo|vacuno)\b/i.test(segment);
  return hasMeat && EATING_VERB_PATTERN.test(segment);
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

    const segments = splitIntoSegments(text);
    let busCount = 0;
    let meatCount = 0;

    for (const segment of segments) {
      if (mentionsBus(segment)) {
        const { distanceKm, hasInvalidDistance } = extractBusDistance(segment);
        if (distanceKm !== null) {
          busCount += 1;
          activities.push({
            category: "transport",
            mode: "bus",
            distanceKm,
            label:
              busCount > 1
                ? `Viaje en bus ${busCount} (${distanceKm} km)`
                : `Viaje en bus (${distanceKm} km)`,
          });
        } else if (hasInvalidDistance) {
          warnings.push(DISTANCE_MUST_BE_POSITIVE_MESSAGE);
        } else {
          warnings.push(
            `Se detectó transporte en bus en "${segment}", pero no se encontró una distancia válida en km.`,
          );
        }
      }

      if (mentionsMeat(segment)) {
        meatCount += 1;
        const estimatedKg = extractMeatQuantityKg(segment);
        activities.push({
          category: "food",
          type: "meat",
          estimatedKg: estimatedKg ?? 0.2,
          label:
            estimatedKg !== null
              ? `Consumo de carne (${estimatedKg} kg)`
              : meatCount > 1
                ? `Consumo de carne ${meatCount} (porción estimada)`
                : "Consumo de carne (porción estimada)",
        });
      }
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
