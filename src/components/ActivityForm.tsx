interface ActivityFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PLACEHOLDER =
  'Ejemplo: "Hoy comí carne y viajé 20 km en bus"';

export function ActivityForm({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ActivityFormProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="activity-input" className="text-sm font-semibold text-eco-800">
        ¿Qué hiciste hoy?
      </label>
      <textarea
        id="activity-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER}
        rows={4}
        disabled={isLoading}
        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-eco-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-200 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Tip: Ctrl+Enter para analizar. Transporte en bus y consumo de carne.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-eco-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analizando...
            </>
          ) : (
            "Analizar actividades"
          )}
        </button>
      </div>
    </div>
  );
}
