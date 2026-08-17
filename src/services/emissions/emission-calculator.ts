import { EMISSION_FACTORS } from "@/constants/emission-factors";
import type {
  ActivityEmission,
  DetectedActivity,
  EmissionAnalysisResult,
} from "@/types/activity";

function calculateActivityEmission(activity: DetectedActivity): ActivityEmission {
  if (activity.category === "transport" && activity.mode === "bus") {
    const co2Kg = activity.distanceKm * EMISSION_FACTORS.transport.bus;
    return {
      activity,
      co2Kg,
      description: `${activity.distanceKm} km × ${EMISSION_FACTORS.transport.bus} kg CO₂/km`,
    };
  }

  if (activity.category === "food" && activity.type === "meat") {
    const co2Kg = activity.estimatedKg * EMISSION_FACTORS.food.meat;
    return {
      activity,
      co2Kg,
      description: `${activity.estimatedKg} kg × ${EMISSION_FACTORS.food.meat} kg CO₂/kg`,
    };
  }

  throw new Error(`Actividad no soportada: ${JSON.stringify(activity)}`);
}

export function calculateEmissions(
  activities: DetectedActivity[],
): EmissionAnalysisResult {
  const emissions = activities.map(calculateActivityEmission);
  const totalCo2Kg = emissions.reduce((sum, item) => sum + item.co2Kg, 0);

  return {
    activities: emissions,
    totalCo2Kg,
  };
}

export function formatCo2Kg(value: number): string {
  return value < 0.01 ? value.toExponential(2) : value.toFixed(3);
}
