import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
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
 * FeatureFlagService — Integración reactiva con Firebase Remote Config.
 *
 * Este servicio gestiona los feature flags de la aplicación obtenidos
 * desde Firebase Remote Config. Permite habilitar/deshabilitar
 * funcionalidades de forma remota sin necesidad de publicar una
 * nueva versión de la app.
 *
 * Características:
 * - Emite cambios reactivamente vía BehaviorSubjects (los componentes
 *   se actualizan automáticamente sin recargar la app).
 * - Polling periódico para detectar cambios en Remote Config.
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
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagService implements OnDestroy {
  /** Instancia de Firebase Remote Config */
  private remoteConfig: RemoteConfig | null = null;

  /** Si el servicio ya fue inicializado */
  private initialized = false;

  /** Intervalo de polling (en ms) */
  private pollingIntervalMs = environment.production ? 60000 : 30000;

  /** Referencia al timer de polling para limpieza */
  private pollingTimer: ReturnType<typeof setInterval> | null = null;

  /** BehaviorSubject con la configuración actual de flags */
  private flagsSubject = new BehaviorSubject<FeatureFlagConfig>({
    categories_enabled: true,
    priorities_enabled: true,
    banner_message: '',
  });

  /** Observable público con la configuración de flags */
  readonly flags$ = this.flagsSubject.asObservable();

  /** Observable reactivo: si categorías están habilitadas */
  readonly categoriesEnabled$: Observable<boolean> = this.flags$.pipe(
    map((flags) => flags.categories_enabled),
    distinctUntilChanged()
  );

  /** Observable reactivo: si prioridades están habilitadas */
  readonly prioritiesEnabled$: Observable<boolean> = this.flags$.pipe(
    map((flags) => flags.priorities_enabled),
    distinctUntilChanged()
  );

  /** Observable reactivo: mensaje de banner */
  readonly bannerMessage$: Observable<string> = this.flags$.pipe(
    map((flags) => flags.banner_message),
    distinctUntilChanged()
  );

  /**
   * Inicializa Firebase y carga los feature flags desde Remote Config.
   *
   * Si Firebase no está configurado (credenciales placeholder), usa
   * los valores por defecto sin lanzar errores.
   *
   * Después de la carga inicial, inicia un polling periódico para
   * detectar cambios en Remote Config automáticamente.
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
        this.pollingIntervalMs;

      // Valores por defecto
      this.remoteConfig.defaultConfig = {
        categories_enabled: true,
        priorities_enabled: true,
        banner_message: '',
      };

      // Fetch inicial y activar
      await this.fetchFlags();

      this.initialized = true;

      // Iniciar polling periódico
      this.startPolling();
    } catch (error) {
      console.warn(
        'FeatureFlagService: Error al cargar feature flags, usando valores por defecto',
        error
      );
      this.initialized = true;
    }
  }

  /**
   * Verifica si un feature flag está habilitado (lectura síncrona).
   *
   * @param flag - Nombre del flag a verificar.
   * @returns true si el flag está habilitado.
   */
  isEnabled(
    flag: keyof Pick<FeatureFlagConfig, 'categories_enabled' | 'priorities_enabled'>
  ): boolean {
    return this.flagsSubject.getValue()[flag];
  }

  /**
   * Obtiene el valor de un flag de tipo string (lectura síncrona).
   *
   * @param key - Nombre del flag.
   * @returns Valor del flag como string.
   */
  getString(key: keyof Pick<FeatureFlagConfig, 'banner_message'>): string {
    return this.flagsSubject.getValue()[key];
  }

  /**
   * Obtiene la configuración completa de feature flags.
   *
   * @returns Copia de la configuración actual.
   */
  getFlags(): FeatureFlagConfig {
    return { ...this.flagsSubject.getValue() };
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  /**
   * Fetch de flags desde Remote Config y emite nuevos valores
   * a través del BehaviorSubject.
   */
  private async fetchFlags(): Promise<void> {
    if (!this.remoteConfig) return;

    try {
      await fetchAndActivate(this.remoteConfig);

      const newFlags: FeatureFlagConfig = {
        categories_enabled: this.parseBooleanValue(
          getValue(this.remoteConfig, 'categories_enabled').asString()
        ),
        priorities_enabled: this.parseBooleanValue(
          getValue(this.remoteConfig, 'priorities_enabled').asString()
        ),
        banner_message: this.cleanStringValue(
          getValue(this.remoteConfig, 'banner_message').asString()
        ),
      };

      this.flagsSubject.next(newFlags);
      console.log('FeatureFlagService: Feature flags actualizados', newFlags);
    } catch (error) {
      console.warn('FeatureFlagService: Error al refrescar feature flags', error);
    }
  }

  /**
   * Parsea un valor booleano desde Remote Config.
   * Remote Config puede devolver "false", "true", "0", "1", etc.
   * como strings. asBoolean() puede fallar si el valor viene con comillas extra.
   */
  private parseBooleanValue(value: string): boolean {
    const cleaned = value.replace(/"/g, '').trim().toLowerCase();
    return cleaned === 'true' || cleaned === '1';
  }

  /**
   * Limpia un valor string de comillas dobles extra que Firebase puede agregar.
   */
  private cleanStringValue(value: string): string {
    // Firebase a veces envuelve strings en comillas dobles extra: '""' o '"value"'
    let cleaned = value.trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    return cleaned;
  }

  /** Inicia el polling periódico de Remote Config */
  private startPolling(): void {
    if (this.pollingTimer) return;

    this.pollingTimer = setInterval(() => {
      this.fetchFlags();
    }, this.pollingIntervalMs);

    console.log(
      `FeatureFlagService: Polling iniciado cada ${this.pollingIntervalMs / 1000}s`
    );
  }

  /** Detiene el polling periódico */
  private stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }
}
