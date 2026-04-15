import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

/**
 * CategoryService — Gestión CRUD de categorías.
 *
 * Proporciona operaciones para crear, leer, actualizar y eliminar categorías.
 * Usa BehaviorSubject para actualizaciones reactivas en la UI y persiste
 * los datos vía @capacitor/preferences.
 *
 * @providedIn 'root' — Servicio singleton disponible en toda la app.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly STORAGE_KEY = 'taskflow_categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private readonly DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
    { name: 'Trabajo', color: '#4C8DFF', icon: 'briefcase-outline' },
    { name: 'Personal', color: '#22C55E', icon: 'person-outline' },
    { name: 'Compras', color: '#FFC409', icon: 'cart-outline' },
    { name: 'Urgente', color: '#EF4444', icon: 'alert-circle-outline' },
  ];

  constructor(private storageService: StorageService) {}

  /** Carga las categorías del almacenamiento. */
  async loadCategories(): Promise<void> {
    const categories = await this.storageService.get<Category[]>(this.STORAGE_KEY);
    if (categories && categories.length > 0) {
      this.categoriesSubject.next(categories);
    } else {
      await this.seedDefaultCategories();
    }
  }

  /** Crea una nueva categoría. */
  async addCategory(data: { name: string; color: string; icon: string }): Promise<Category> {
    const existing = this.categoriesSubject.getValue();
    const nameExists = existing.some(
      (cat) => cat.name.toLowerCase() === data.name.trim().toLowerCase()
    );
    if (nameExists) {
      throw new Error(`Ya existe una categoría con el nombre "${data.name}"`);
    }

    const category: Category = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      color: data.color,
      icon: data.icon,
      createdAt: new Date().toISOString(),
    };

    const categories = [...existing, category];
    this.categoriesSubject.next(categories);
    await this.persistCategories(categories);
    return category;
  }

  /** Actualiza una categoría existente. */
  async updateCategory(
    id: string,
    updates: Partial<Pick<Category, 'name' | 'color' | 'icon'>>
  ): Promise<Category> {
    let updatedCategory: Category | undefined;
    const categories = this.categoriesSubject.getValue().map((cat) => {
      if (cat.id === id) {
        updatedCategory = { ...cat, ...updates };
        return updatedCategory;
      }
      return cat;
    });
    if (!updatedCategory) {
      throw new Error(`Categoría con ID "${id}" no encontrada`);
    }
    this.categoriesSubject.next(categories);
    await this.persistCategories(categories);
    return updatedCategory;
  }

  /** Elimina una categoría. */
  async deleteCategory(id: string): Promise<void> {
    const categories = this.categoriesSubject.getValue().filter((cat) => cat.id !== id);
    this.categoriesSubject.next(categories);
    await this.persistCategories(categories);
  }

  /** Obtiene una categoría por su ID. */
  getCategoryById(id: string): Category | undefined {
    return this.categoriesSubject.getValue().find((cat) => cat.id === id);
  }

  private async seedDefaultCategories(): Promise<void> {
    const now = new Date().toISOString();
    const categories: Category[] = this.DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      id: crypto.randomUUID(),
      createdAt: now,
    }));
    this.categoriesSubject.next(categories);
    await this.persistCategories(categories);
  }

  private async persistCategories(categories: Category[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, categories);
  }
}
