/**
 * Factores de emisión provisionales para demostración del MVP.
 * NO son datos científicos oficiales. Reemplazar con fuentes verificadas en producción.
 */
export const EMISSION_FACTORS = {
  transport: {
    /** kg CO₂ por km recorrido en bus (valor de demostración) */
    bus: 0.089,
  },
  food: {
    /** kg CO₂ por kg de carne consumida (valor de demostración) */
    meat: 27,
    /** Porción por defecto cuando no se especifica cantidad (valor de demostración) */
    defaultMeatPortionKg: 0.2,
  },
} as const;

export const DEMO_DISCLAIMER =
  "Los factores de emisión son valores provisionales de demostración, no datos científicos oficiales.";
