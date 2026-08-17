import { DEMO_DISCLAIMER } from "@/constants/emission-factors";
import { formatCo2Kg } from "@/services/emissions/emission-calculator";
import type { EmissionAnalysisResult, ParseResult } from "@/types/activity";

interface AnalysisResultsProps {
  parseResult: ParseResult;
  emissionResult: EmissionAnalysisResult;
}

export function AnalysisResults({
  parseResult,
  emissionResult,
}: AnalysisResultsProps) {
  return (
    <section
      aria-label="Resultados del análisis"
      className="rounded-2xl border border-eco-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-xl font-bold text-eco-900">Resultados</h2>

      {parseResult.warnings.length > 0 && (
        <ul className="mt-4 space-y-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {parseResult.warnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Actividades detectadas
        </h3>
        <ul className="mt-3 space-y-3">
          {emissionResult.activities.map((item) => (
            <li
              key={`${item.activity.category}-${item.activity.label}`}
              className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-800">{item.activity.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <p className="text-sm font-semibold text-eco-700">
                {formatCo2Kg(item.co2Kg)} kg CO₂
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl bg-eco-600 px-6 py-5 text-white">
        <p className="text-sm font-medium text-eco-100">Total estimado</p>
        <p className="mt-1 text-3xl font-bold">
          {formatCo2Kg(emissionResult.totalCo2Kg)} kg CO₂
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">{DEMO_DISCLAIMER}</p>
    </section>
  );
}
