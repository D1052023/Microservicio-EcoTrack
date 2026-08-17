export const DISTANCE_MUST_BE_POSITIVE_MESSAGE =
  "La distancia debe ser mayor que cero.";

export type DistanceValidationResult =
  | { status: "valid"; distanceKm: number }
  | { status: "invalid"; message: string }
  | { status: "not_found" };

export function validateDistanceKm(rawValue: string): DistanceValidationResult {
  const normalized = rawValue.replace(",", ".");
  const distance = parseFloat(normalized);

  if (Number.isNaN(distance)) {
    return { status: "not_found" };
  }

  if (distance <= 0) {
    return { status: "invalid", message: DISTANCE_MUST_BE_POSITIVE_MESSAGE };
  }

  return { status: "valid", distanceKm: distance };
}
