import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * SwipeHintService — Controla la visualización de los hints de deslizamiento.
 *
 * Utiliza el StorageService para asegurar que el onboarding de "deslizar para eliminar/editar"
 * se muestre solo una vez por dispositivo.
 */
@Injectable({
  providedIn: 'root'
})
export class SwipeHintService {
  constructor(private storageService: StorageService) {}

  async shouldShowTaskHint(): Promise<boolean> {
    const shown = await this.storageService.get<boolean>('taskflow_task_hint_shown');
    return !shown;
  }

  async markTaskHintShown(): Promise<void> {
    await this.storageService.set('taskflow_task_hint_shown', true);
  }

  async shouldShowCategoryHint(): Promise<boolean> {
    const shown = await this.storageService.get<boolean>('taskflow_category_hint_shown');
    return !shown;
  }

  async markCategoryHintShown(): Promise<void> {
    await this.storageService.set('taskflow_category_hint_shown', true);
  }
}
