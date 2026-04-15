import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';
import { environment } from '../../environments/environment';
import { FeatureFlagConfig } from '../models/feature-flag.model';

/**
 * FeatureFlagService — Integración con Firebase Remote Config.
 *
 * Este servicio gestiona los feature flags de la aplicación obtenidos
 * desde Firebase Remote Config. Permite habilitar/deshabilitar
 * funcionalidades de forma remota sin necesidad de publicar una
 * nueva versión de la app.
 *
 * Flags disponibles:
 * - categories_enabled: Muestra/oculta la pestaña y funcionalidad de categorías.
 * - priorities_enabled: Muestra/oculta el selector de prioridad en tareas.
 * - banner_message: Mensaje informativo mostrado en la parte superior.
 *
 * Valores por defecto (usados si Remote Config falla o no está configurado):
 * - categories_enabled = true
 * - priorities_enabled = true
 * - banner_message = '' (sin banner)
 *
 * @providedIn 'root' — Servicio singleton.
 *
 * @example
 * ```typescript
 * // En un componente
 * constructor(private featureFlagService: FeatureFlagService) {}
 *
 * async ngOnInit() {
 *   await this.featureFlagService.initialize();
 *   if (this.featureFlagService.isEnabled('categories_enabled')) {
 *     // Mostrar categorías
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  /** Instancia de Firebase Remote Config */
  private remoteConfig: RemoteConfig | null = null;

  /** Si el servicio ya fue inicializado */
  private initialized = false;

  /** Configuración actual de feature flags */
  private flags: FeatureFlagConfig = {
    categories_enabled: true,
    priorities_enabled: true,
    banner_message: '',
  };

  /**
   * Inicializa Firebase y carga los feature flags desde Remote Config.
   *
   * Si Firebase no está configurado (credenciales placeholder), usa
   * los valores por defecto sin lanzar errores.
   *
   * El intervalo mínimo de fetch es de 3600 segundos (1 hora) en producción
   * y 300 segundos (5 minutos) en desarrollo.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Verificar si Firebase está configurado
      if (
        !environment.firebase.apiKey ||
        environment.firebase.apiKey === 'TU_API_KEY'
      ) {
        console.warn(
          'FeatureFlagService: Firebase no configurado. Usando valores por defecto.'
        );
        this.initialized = true;
        return;
      }

      const app = initializeApp(environment.firebase);
      this.remoteConfig = getRemoteConfig(app);

      // Intervalo mínimo de fetch
      this.remoteConfig.settings.minimumFetchIntervalMillis =
        environment.production ? 3600000 : 300000;

      // Valores por defecto
      this.remoteConfig.defaultConfig = {
        categories_enabled: true,
        priorities_enabled: true,
        banner_message: '',
      };

      // Fetch y activar
      await fetchAndActivate(this.remoteConfig);

      // Leer valores
      this.flags = {
        categories_enabled: getValue(this.remoteConfig, 'categories_enabled').asBoolean(),
        priorities_enabled: getValue(this.remoteConfig, 'priorities_enabled').asBoolean(),
        banner_message: getValue(this.remoteConfig, 'banner_message').asString(),
      };

      this.initialized = true;
      console.log('FeatureFlagService: Feature flags cargados', this.flags);
    } catch (error) {
      console.warn('FeatureFlagService: Error al cargar feature flags, usando valores por defecto', error);
      this.initialized = true;
    }
  }

  /**
   * Verifica si un feature flag está habilitado.
   *
   * @param flag - Nombre del flag a verificar.
   * @returns true si el flag está habilitado.
   */
  isEnabled(flag: keyof Pick<FeatureFlagConfig, 'categories_enabled' | 'priorities_enabled'>): boolean {
    return this.flags[flag];
  }

  /**
   * Obtiene el valor de un flag de tipo string.
   *
   * @param key - Nombre del flag.
   * @returns Valor del flag como string.
   */
  getString(key: keyof Pick<FeatureFlagConfig, 'banner_message'>): string {
    return this.flags[key];
  }

  /**
   * Obtiene la configuración completa de feature flags.
   *
   * @returns Copia de la configuración actual.
   */
  getFlags(): FeatureFlagConfig {
    return { ...this.flags };
  }
}
