"use client";

import { useState } from "react";
import type { AnalysisStatus, EcoTrackAnalysisResult } from "@/types/activity";
import { ActivityForm } from "@/components/ActivityForm";
import { AnalysisResults } from "@/components/AnalysisResults";
import { StatusMessage } from "@/components/StatusMessage";

interface ApiErrorResponse {
  error: string;
}

export function EcoTrackApp() {
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<EcoTrackAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAnalyze() {
    const trimmed = inputText.trim();

    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Escribe una descripción de tus actividades antes de analizar.");
      setResult(null);
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiErrorResponse;
        throw new Error(errorData.error ?? "Error al procesar la solicitud.");
      }

      const data = (await response.json()) as EcoTrackAnalysisResult;
      setResult(data);

      if (data.parseResult.activities.length === 0) {
        setStatus("error");
        setErrorMessage(
          data.parseResult.warnings[0] ??
            "No se detectaron actividades compatibles con el MVP.",
        );
        return;
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-eco-100 px-4 py-1.5 text-sm font-medium text-eco-800">
          <span aria-hidden="true">🌱</span>
          Huella de carbono simplificada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-eco-900 sm:text-5xl">
          EcoTrack
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Describe tu día en lenguaje natural y obtén una estimación de tus
          emisiones de CO₂.
        </p>
      </header>

      <section
        aria-label="Entrada de actividades"
        className="rounded-2xl border border-eco-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <ActivityForm
          value={inputText}
          onChange={setInputText}
          onSubmit={handleAnalyze}
          isLoading={status === "loading"}
        />
      </section>

      <StatusMessage status={status} errorMessage={errorMessage} />

      {status === "success" && result?.emissionResult && (
        <AnalysisResults
          parseResult={result.parseResult}
          emissionResult={result.emissionResult}
        />
      )}
    </div>
  );
}
