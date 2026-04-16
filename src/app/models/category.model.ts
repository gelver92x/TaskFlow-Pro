/**
 * Modelo Category — Representa una categoría para agrupar tareas.
 *
 * Las categorías permiten organizar las tareas por tipo o contexto.
 * Cada categoría tiene un color y un icono para identificación visual rápida.
 *
 * Se persisten a través del CategoryService.
 */
export interface Category {
  /** Identificador único generado con crypto.randomUUID() */
  id: string;

  /** Nombre de la categoría (único, máx. 50 caracteres) */
  name: string;

  /** Color representativo en formato HEX (#RRGGBB) */
  color: string;

  /** Nombre del icono Ionicon (ej: 'briefcase-outline') */
  icon: string;

  /** Timestamp ISO 8601 de cuándo se creó la categoría */
  createdAt: string;
}
