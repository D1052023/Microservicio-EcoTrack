export type ActivityCategory = "transport" | "food";

export type TransportMode = "bus";

export type FoodType = "meat";

export interface BusTransportActivity {
  category: "transport";
  mode: TransportMode;
  distanceKm: number;
  label: string;
}

export interface MeatFoodActivity {
  category: "food";
  type: FoodType;
  /** Porción estimada en kg para el MVP */
  estimatedKg: number;
  label: string;
}

export type DetectedActivity = BusTransportActivity | MeatFoodActivity;

export interface ActivityEmission {
  activity: DetectedActivity;
  co2Kg: number;
  description: string;
}

export interface EmissionAnalysisResult {
  activities: ActivityEmission[];
  totalCo2Kg: number;
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export interface UserActivityInput {
  text: string;
}

export interface ParseResult {
  activities: DetectedActivity[];
  warnings: string[];
}

export interface AnalysisError {
  message: string;
}

export interface EcoTrackAnalysisResult {
  parseResult: ParseResult;
  emissionResult: EmissionAnalysisResult | null;
}
