import { Injectable } from '@angular/core';

declare const NativeStorage: any;

/**
 * StorageService — Capa de abstracción para almacenamiento persistente.
 *
 * Utiliza NativeStorage (plugin Cordova) cuando está disponible en entorno
 * nativo, con fallback automático a localStorage para desarrollo web.
 *
 * En dispositivos nativos, NativeStorage usa SharedPreferences (Android)
 * y UserDefaults (iOS), que están protegidos contra limpieza de caché.
 *
 * @providedIn 'root' — Servicio singleton disponible en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Detecta si NativeStorage (Cordova) está disponible.
   */
  private get isNative(): boolean {
    return typeof NativeStorage !== 'undefined';
  }

  /**
   * Recupera un valor del almacenamiento por clave.
   * Retorna null si la clave no existe o el valor no se puede parsear.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isNative) {
        const value = await new Promise<string>((resolve, reject) => {
          NativeStorage.getItem(key, resolve, reject);
        });
        return JSON.parse(value) as T;
      } else {
        const value = localStorage.getItem(key);
        if (value === null) return null;
        return JSON.parse(value) as T;
      }
    } catch {
      return null;
    }
  }

  /**
   * Almacena un valor serializado como JSON.
   */
  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    if (this.isNative) {
      await new Promise<void>((resolve, reject) => {
        NativeStorage.setItem(key, serialized, resolve, reject);
      });
    } else {
      localStorage.setItem(key, serialized);
    }
  }

  /**
   * Elimina un par clave-valor del almacenamiento.
   */
  async remove(key: string): Promise<void> {
    if (this.isNative) {
      await new Promise<void>((resolve, reject) => {
        NativeStorage.remove(key, resolve, reject);
      });
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * Limpia todos los datos del almacenamiento.
   */
  async clear(): Promise<void> {
    if (this.isNative) {
      await new Promise<void>((resolve, reject) => {
        NativeStorage.clear(resolve, reject);
      });
    } else {
      localStorage.clear();
    }
  }
}
