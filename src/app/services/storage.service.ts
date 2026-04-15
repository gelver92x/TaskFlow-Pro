import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * StorageService — Abstraction layer over @capacitor/preferences.
 *
 * This service provides typed, async key-value storage for the application.
 * It wraps the Capacitor Preferences API to handle JSON serialization
 * and deserialization transparently.
 *
 * IMPORTANT: Never use localStorage directly — this is the only
 * approved storage mechanism per project guidelines.
 *
 * All methods are asynchronous because Capacitor Preferences
 * uses native storage on devices (SharedPreferences on Android,
 * UserDefaults on iOS).
 *
 * @providedIn 'root' — Singleton service available application-wide.
 *
 * @example
 * ```typescript
 * // Save data
 * await this.storageService.set('my_key', { name: 'value' });
 *
 * // Retrieve data
 * const data = await this.storageService.get<MyType>('my_key');
 *
 * // Remove data
 * await this.storageService.remove('my_key');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Retrieves a value from storage by key.
   * Returns null if the key does not exist or the value cannot be parsed.
   *
   * @template T - The expected type of the stored value.
   * @param key - The storage key to look up.
   * @returns A promise resolving to the parsed value or null.
   */
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Stores a value in storage, serialized as JSON.
   *
   * @template T - The type of the value to store.
   * @param key - The storage key.
   * @param value - The value to serialize and store.
   */
  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  /**
   * Removes a single key-value pair from storage.
   *
   * @param key - The storage key to remove.
   */
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  /**
   * Clears all data from storage.
   * Use with caution — this removes ALL stored data for the app.
   */
  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
