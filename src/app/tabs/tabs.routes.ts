import { Routes } from '@angular/router';

/**
 * Rutas hijas del layout de pestañas.
 *
 * Cada pestaña carga su página de forma diferida (lazy loading)
 * usando loadComponent para optimizar el bundle inicial.
 */
export const tabsRoutes: Routes = [
  {
    path: 'tasks',
    loadComponent: () =>
      import('../features/tasks/task-list/task-list.page').then(
        (m) => m.TaskListPage
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../features/categories/category-list/category-list.page').then(
        (m) => m.CategoryListPage
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../features/settings/settings.page').then(
        (m) => m.SettingsPage
      ),
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
];
