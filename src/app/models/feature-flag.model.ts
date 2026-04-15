/**
 * Modelo FeatureFlagConfig — Configuración de feature flags via Firebase Remote Config.
 *
 * Estas banderas controlan qué funcionalidades están habilitadas en la app.
 */
export interface FeatureFlagConfig {
  /** Si la funcionalidad de categorías está habilitada */
  categories_enabled: boolean;

  /** Si la funcionalidad de prioridades está habilitada */
  priorities_enabled: boolean;

  /** Mensaje de banner para mostrar en la UI (vacío = sin banner) */
  banner_message: string;
}
