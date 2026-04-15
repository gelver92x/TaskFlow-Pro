import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskPriority } from '../models/task.model';
import { StorageService } from './storage.service';

/**
 * TaskService — Gestión CRUD de tareas.
 *
 * Proporciona gestión reactiva de tareas usando BehaviorSubject de RxJS
 * para actualizaciones en tiempo real en la UI, con almacenamiento
 * persistente vía @capacitor/preferences a través del StorageService.
 *
 * @providedIn 'root' — Servicio singleton disponible en toda la app.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'taskflow_tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {}

  /** Carga las tareas del almacenamiento, migrando datos antiguos si es necesario. */
  async loadTasks(): Promise<void> {
    const tasks = await this.storageService.get<Task[]>(this.STORAGE_KEY);
    if (tasks) {
      const migrated = tasks.map((task) => ({
        ...task,
        categoryId: task.categoryId ?? null,
        priority: task.priority ?? 'medium' as TaskPriority,
      }));
      this.tasksSubject.next(migrated);
    } else {
      this.tasksSubject.next([]);
    }
  }

  /** Crea una nueva tarea y la persiste. */
  async addTask(data: {
    title: string;
    description?: string;
    categoryId?: string | null;
    priority?: TaskPriority;
  }): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      completed: false,
      categoryId: data.categoryId ?? null,
      priority: data.priority ?? 'medium',
      createdAt: now,
      updatedAt: now,
    };
    const tasks = [task, ...this.tasksSubject.getValue()];
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
    return task;
  }

  /** Alterna el estado de completitud de una tarea. */
  async toggleComplete(id: string): Promise<void> {
    const tasks = this.tasksSubject.getValue().map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
  }

  /** Elimina permanentemente una tarea. */
  async deleteTask(id: string): Promise<void> {
    const tasks = this.tasksSubject.getValue().filter((task) => task.id !== id);
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
  }

  /** Obtiene las tareas filtradas por categoría. */
  getTasksByCategory(categoryId: string | null): Task[] {
    return this.tasksSubject.getValue().filter((t) => t.categoryId === categoryId);
  }

  /** Desasocia todas las tareas de una categoría eliminada. */
  async removeCategoryFromTasks(categoryId: string): Promise<void> {
    const tasks = this.tasksSubject.getValue().map((task) => {
      if (task.categoryId === categoryId) {
        return { ...task, categoryId: null, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    this.tasksSubject.next(tasks);
    await this.persistTasks(tasks);
  }

  /** Retorna estadísticas de conteo. */
  getTaskCount(): { total: number; completed: number; pending: number } {
    const tasks = this.tasksSubject.getValue();
    const completed = tasks.filter((t) => t.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }

  private async persistTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, tasks);
  }
}
