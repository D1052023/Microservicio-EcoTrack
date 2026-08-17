import type { AnalysisStatus } from "@/types/activity";

interface StatusMessageProps {
  status: AnalysisStatus;
  errorMessage: string | null;
}

export function StatusMessage({ status, errorMessage }: StatusMessageProps) {
  if (status === "idle") {
    return null;
  }

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-eco-200 bg-eco-50 px-4 py-3 text-sm text-eco-800"
      >
        Procesando tu descripción e identificando actividades...
      </div>
    );
  }

  if (status === "error" && errorMessage) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {errorMessage}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-eco-200 bg-eco-50 px-4 py-3 text-sm text-eco-800"
      >
        Análisis completado. Revisa el desglose de emisiones abajo.
      </div>
    );
  }

  return null;
}
