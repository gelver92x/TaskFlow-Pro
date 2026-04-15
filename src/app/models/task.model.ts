/**
 * Tipo de prioridad de una tarea.
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Modelo Task — Representa una tarea en la aplicación.
 *
 * Incluye campos extendidos para soporte de categorías y prioridad.
 * Se persiste en @capacitor/preferences a través del StorageService.
 */
export interface Task {
  /** Identificador único generado con crypto.randomUUID() */
  id: string;

  /** Título de la tarea (requerido, máx. 100 caracteres) */
  title: string;

  /** Descripción detallada opcional (máx. 500 caracteres) */
  description?: string;

  /** Si la tarea está marcada como completada */
  completed: boolean;

  /** ID de la categoría asignada (null = sin categoría) */
  categoryId: string | null;

  /** Nivel de prioridad de la tarea */
  priority: TaskPriority;

  /** Timestamp ISO 8601 de cuándo se creó la tarea */
  createdAt: string;

  /** Timestamp ISO 8601 de la última actualización */
  updatedAt: string;
}
