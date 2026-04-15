import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

/**
 * TaskService — Manages CRUD operations for tasks.
 *
 * This service provides reactive task management using RxJS BehaviorSubject
 * for real-time UI updates, with persistent storage via @capacitor/preferences
 * through the StorageService abstraction.
 *
 * Data flow:
 * 1. On initialization, tasks are loaded from device storage.
 * 2. Any mutation (add, toggle, delete) updates both the in-memory
 *    BehaviorSubject and persists changes to storage.
 * 3. Components subscribe to tasks$ for reactive updates.
 *
 * @providedIn 'root' — Singleton service available application-wide.
 *
 * @example
 * ```typescript
 * // In a component
 * constructor(private taskService: TaskService) {}
 *
 * ngOnInit() {
 *   this.taskService.loadTasks();
 *   this.taskService.tasks$.subscribe(tasks => console.log(tasks));
 * }
 *
 * addNew() {
 *   this.taskService.addTask('Buy milk');
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  /** Storage key used in @capacitor/preferences */
  private readonly STORAGE_KEY = 'taskflow_tasks';

  /** Internal BehaviorSubject holding the current task list */
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  /**
   * Observable stream of the current task list.
   * Components should subscribe to this for reactive updates.
   * Use with the `async` pipe in templates for automatic unsubscription.
   */
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {}

  /**
   * Loads tasks from device storage into the in-memory BehaviorSubject.
   * Should be called once during app initialization (e.g., in ngOnInit of the home page).
   * If no tasks exist in storage, initializes with an empty array.
   */
  async loadTasks(): Promise<void> {
    const tasks = await this.storageService.get<Task[]>(this.STORAGE_KEY);
    this.tasksSubject.next(tasks ?? []);
  }

  /**
   * Creates a new task and persists it to storage.
   *
   * Generates a unique ID using crypto.randomUUID(), sets timestamps,
   * and prepends the task to the list (newest first).
   *
   * @param title - The title of the new task (required, should be non-empty).
   * @returns A promise resolving to the newly created Task object.
   */
  async addTask(title: string): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const tasks = [task, ...this.tasksSubject.getValue()];
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);

    return task;
  }

  /**
   * Toggles the completed status of a task.
   *
   * Flips the `completed` boolean and updates the `updatedAt` timestamp.
   *
   * @param id - The unique identifier of the task to toggle.
   */
  async toggleComplete(id: string): Promise<void> {
    const tasks = this.tasksSubject.getValue().map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
  }

  /**
   * Permanently deletes a task from the list and storage.
   *
   * @param id - The unique identifier of the task to delete.
   */
  async deleteTask(id: string): Promise<void> {
    const tasks = this.tasksSubject.getValue().filter((task) => task.id !== id);
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
  }

  /**
   * Returns count statistics about the current task list.
   *
   * @returns An object with total, completed, and pending counts.
   */
  getTaskCount(): { total: number; completed: number; pending: number } {
    const tasks = this.tasksSubject.getValue();
    const completed = tasks.filter((t) => t.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }

  /**
   * Persists the current task array to device storage.
   * Called internally after every mutation.
   *
   * @param tasks - The complete task array to persist.
   */
  private async persistTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, tasks);
  }
}
