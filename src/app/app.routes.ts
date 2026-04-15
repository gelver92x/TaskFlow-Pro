import { Routes } from '@angular/router';

/**
 * Rutas principales de la aplicación.
 *
 * Usa un layout de pestañas (tabs) como contenedor principal.
 * Las rutas hijas se definen en tabs.routes.ts con lazy loading.
 */
export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then((m) => m.TabsPage),
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.tabsRoutes),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
