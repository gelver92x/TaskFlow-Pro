/**
 * Task model — Represents a single to-do item in the application.
 *
 * This interface defines the shape of task data that is persisted
 * in device storage via @capacitor/preferences through the StorageService.
 *
 * @example
 * ```typescript
 * const task: Task = {
 *   id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
 *   title: 'Buy groceries',
 *   completed: false,
 *   createdAt: '2026-04-15T12:00:00.000Z',
 *   updatedAt: '2026-04-15T12:00:00.000Z',
 * };
 * ```
 */
export interface Task {
  /** Unique identifier generated with crypto.randomUUID() */
  id: string;

  /** Title of the task (required, max 100 characters) */
  title: string;

  /** Whether the task has been marked as completed */
  completed: boolean;

  /** ISO 8601 timestamp of when the task was created */
  createdAt: string;

  /** ISO 8601 timestamp of the last update to the task */
  updatedAt: string;
}
