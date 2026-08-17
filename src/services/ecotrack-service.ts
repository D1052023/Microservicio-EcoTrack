import { activityParser } from "@/services/parser/local-activity-parser";
import { calculateEmissions } from "@/services/emissions/emission-calculator";
import type { EcoTrackAnalysisResult, UserActivityInput } from "@/types/activity";

export function analyzeUserActivities(
  input: UserActivityInput,
): EcoTrackAnalysisResult {
  const parseResult = activityParser.parse(input.text);

  if (parseResult.activities.length === 0) {
    return { parseResult, emissionResult: null };
  }

  const emissionResult = calculateEmissions(parseResult.activities);
  return { parseResult, emissionResult };
}
