# TaskFlow 📋 — Versión Extendida

Aplicación móvil de gestión de tareas con categorías, búsqueda avanzada y feature flags, construida con **Ionic 8**, **Angular 20**, **Capacitor 8** y **Firebase Remote Config**.

Esta es la versión extendida (fork) que agrega funcionalidades avanzadas sobre la [app base](https://github.com/gelver92x/TaskFlow-Ionic/tree/main).

## Funcionalidades

### Tareas
- ✅ **CRUD de tareas** — Crear, completar, eliminar con confirmación
- ✅ **Descripción** — Campo opcional de descripción detallada
- ✅ **Prioridad** — Baja (verde), media (ámbar), alta (roja) con indicador visual
- ✅ **Asignación de categoría** — Seleccionar categoría al crear/editar
- ✅ **Búsqueda** — Barra de búsqueda con debounce de 300ms
- ✅ **Filtro por categoría** — Segmento scrollable en la cabecera
- ✅ **Swipe-to-delete** — Deslizar para eliminar con confirmación
- ✅ **Pull to refresh** — Recargar datos desde almacenamiento

### Categorías
- ✅ **CRUD de categorías** — Crear, editar, eliminar
- ✅ **Categorías predeterminadas** — Trabajo, Personal, Compras, Urgente
- ✅ **Personalización** — Selector de color (12 colores) e icono (12 iconos)
- ✅ **Vista previa en vivo** — Preview del color + icono al editar
- ✅ **Conteo de tareas** — Badge con número de tareas por categoría
- ✅ **Desasociación automática** — Al eliminar una categoría, las tareas se desvinculan

### Firebase Remote Config
- ✅ **Feature flags remotos** — Controlar funcionalidades sin publicar nuevas versiones
- ✅ **categories_enabled** — Mostrar/ocultar pestaña de categorías
- ✅ **priorities_enabled** — Mostrar/ocultar selector de prioridad
- ✅ **banner_message** — Mostrar mensajes informativos
- ✅ **Fallback graceful** — Si Firebase no está configurado, usa valores por defecto

### General
- ✅ **Navegación por tabs** — ion-tabs con ion-tab-bar (Tareas, Categorías, Ajustes)
- ✅ **i18n** — Inglés y español (detección automática + selector manual)
- ✅ **Modo oscuro** — Automático + selector en ajustes (Sistema/Claro/Oscuro)
- ✅ **Almacenamiento nativo** — @capacitor/preferences (nunca localStorage)
- ✅ **Componentes standalone** — Sin NgModules, imports individuales de Ionic

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| [Ionic Framework](https://ionicframework.com/) | 8.x | Componentes UI móviles |
| [Angular](https://angular.dev/) | 20.x | Framework frontend |
| [Capacitor](https://capacitorjs.com/) | 8.x | Runtime nativo |
| [Firebase](https://firebase.google.com/) | 11.x | Remote Config / Feature Flags |
| [@capacitor/preferences](https://capacitorjs.com/docs/apis/preferences) | 8.x | Almacenamiento clave-valor |
| [@ngx-translate/core](https://github.com/ngx-translate/core) | 17.x | Internacionalización |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | JavaScript con tipado seguro |

## Estructura del Proyecto

```
src/
├── app/
│   ├── app.component.ts                # Componente raíz (idioma + feature flags)
│   ├── app.component.html              # Shell: <ion-app><ion-router-outlet>
│   ├── app.routes.ts                   # Rutas principales (tabs layout)
│   │
│   ├── tabs/                           # Layout de pestañas
│   │   ├── tabs.page.ts                # Lógica (feature flag -> ocultar tabs)
│   │   ├── tabs.page.html              # Template con ion-tabs + ion-tab-bar
│   │   ├── tabs.page.scss              # Estilos del tab bar
│   │   └── tabs.routes.ts              # Rutas hijas (tasks, categories, settings)
│   │
│   ├── features/
│   │   ├── tasks/
│   │   │   ├── task-list/              # Página principal de tareas
│   │   │   │   ├── task-list.page.ts   # Lógica: filtro, búsqueda, CRUD
│   │   │   │   ├── task-list.page.html # Template con searchbar + segment
│   │   │   │   └── task-list.page.scss
│   │   │   └── components/
│   │   │       ├── task-item/          # Componente de tarea individual
│   │   │       │   ├── task-item.component.ts
│   │   │       │   ├── task-item.component.html
│   │   │       │   └── task-item.component.scss
│   │   │       └── task-form-modal/    # Modal de creación de tareas
│   │   │           ├── task-form-modal.component.ts
│   │   │           ├── task-form-modal.component.html
│   │   │           └── task-form-modal.component.scss
│   │   │
│   │   ├── categories/
│   │   │   ├── category-list/          # Página de categorías
│   │   │   │   ├── category-list.page.ts
│   │   │   │   ├── category-list.page.html
│   │   │   │   └── category-list.page.scss
│   │   │   └── components/
│   │   │       └── category-form-modal/  # Modal con color/icon picker
│   │   │           ├── category-form-modal.component.ts
│   │   │           ├── category-form-modal.component.html
│   │   │           └── category-form-modal.component.scss
│   │   │
│   │   └── settings/                   # Página de ajustes
│   │       ├── settings.page.ts
│   │       ├── settings.page.html
│   │       └── settings.page.scss
│   │
│   ├── services/
│   │   ├── storage.service.ts          # Wrapper sobre @capacitor/preferences
│   │   ├── task.service.ts             # CRUD tareas + filtro categoría
│   │   ├── category.service.ts         # CRUD categorías + seed
│   │   └── feature-flag.service.ts     # Firebase Remote Config
│   │
│   └── models/
│       ├── task.model.ts               # Task (title, description, priority, categoryId)
│       ├── category.model.ts           # Category (name, color, icon)
│       └── feature-flag.model.ts       # FeatureFlagConfig
│
├── assets/i18n/
│   ├── en.json                         # Traducciones inglés
│   └── es.json                         # Traducciones español
│
├── environments/
│   ├── environment.ts                  # Config desarrollo + Firebase
│   └── environment.prod.ts             # Config producción + Firebase
│
├── theme/variables.scss                # Tema Indigo + modo oscuro
├── global.scss                         # Estilos globales + Inter font
├── main.ts                             # Bootstrap con providers
└── index.html                          # HTML de entrada
```

## Modelos de Datos

### Task (Tarea)

```typescript
interface Task {
  id: string;                    // UUID v4
  title: string;                 // Título (máx. 100 chars)
  description?: string;          // Descripción opcional
  completed: boolean;            // Estado de completitud
  categoryId: string | null;     // ID de categoría (null = sin categoría)
  priority: 'low' | 'medium' | 'high'; // Prioridad
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

### Category (Categoría)

```typescript
interface Category {
  id: string;         // UUID v4
  name: string;       // Nombre único (máx. 50 chars)
  color: string;      // HEX (#RRGGBB)
  icon: string;       // Nombre Ionicon
  createdAt: string;  // ISO 8601
}
```

### FeatureFlagConfig

```typescript
interface FeatureFlagConfig {
  categories_enabled: boolean;   // Pestaña de categorías
  priorities_enabled: boolean;   // Selector de prioridad
  banner_message: string;        // Mensaje informativo
}
```

## Pre-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Ionic CLI** (opcional, vía npx)

Para compilación nativa:
- **Android Studio** + Android SDK 34+ (para Android)
- **Xcode** 15+ (para iOS — solo macOS)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/gelver92x/TaskFlow-Ionic.git
cd TaskFlow-Ionic
git checkout feature/categories-firebase

# Instalar dependencias
npm install
```

## Configuración de Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: `TaskFlow` (o el que prefieras)
4. Desactiva Google Analytics (opcional para esta app)
5. Haz clic en **"Crear proyecto"**

### 2. Agregar app web

1. En la página principal del proyecto, haz clic en el ícono **Web** (`</>`)
2. Nombre de la app: `TaskFlow Web`
3. **No** marques Firebase Hosting
4. Haz clic en **"Registrar app"**
5. Copia las credenciales de la configuración de Firebase

### 3. Configurar credenciales en el proyecto

Reemplaza los valores placeholder en los archivos de entorno:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY_REAL',
    authDomain: 'tu-proyecto-real.firebaseapp.com',
    projectId: 'tu-proyecto-real',
    storageBucket: 'tu-proyecto-real.firebasestorage.app',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456',
  },
};
```

### 4. Configurar Remote Config

1. En Firebase Console, ve a **"Compilación > Remote Config"**
2. Haz clic en **"Crear configuración"**
3. Agrega los siguientes parámetros:

| Parámetro | Tipo | Valor por defecto |
|---|---|---|
| `categories_enabled` | Boolean | `true` |
| `priorities_enabled` | Boolean | `true` |
| `banner_message` | String | `""` |

4. Haz clic en **"Publicar cambios"**

> **Nota:** Si no configuras Firebase, la app funciona normalmente con todos los features habilitados por defecto.

## Ejecución

### Navegador (Desarrollo)

```bash
npx ionic serve
```

### Android

```bash
# Compilar assets web
npx ng build --configuration production

# Agregar plataforma Android (primera vez)
npx cap add android

# Sincronizar assets con el proyecto nativo
npx cap sync android

# Abrir en Android Studio
npx cap open android
```

En Android Studio:
1. Espera a que Gradle sincronice el proyecto
2. Selecciona un dispositivo/emulador
3. Haz clic en **Run** (▶)

### iOS (solo macOS)

```bash
npx ng build --configuration production
npx cap add ios
npx cap sync ios
npx cap open ios
```

En Xcode:
1. Selecciona un simulador o dispositivo
2. Haz clic en **Run** (▶)

### Generar APK (Android)

```bash
# Compilar y sincronizar
npx ng build --configuration production
npx cap sync android

# En Android Studio:
# Build > Generate Signed Bundle / APK > APK
# Selecciona tu keystore o crea uno nuevo
# Selecciona release, firma y genera
```

El APK firmado se encontrará en:
`android/app/release/app-release.apk`

## Decisiones de Arquitectura

| Decisión | Justificación |
|---|---|
| **Standalone Components** | Angular 17+ best practice, eliminando NgModules |
| **@capacitor/preferences** | Reemplazo obligatorio de localStorage para cross-platform |
| **Feature-based structure** | Carpetas por funcionalidad (tasks/, categories/, settings/) |
| **ion-tabs + ion-tab-bar** | Obligatorio según skill ionic-skills |
| **BehaviorSubject** | Flujo reactivo con limpieza automática via async pipe |
| **Firebase Remote Config** | Feature flags sin publicar nuevas versiones |
| **TranslateHttpLoader** | i18n lazy-loaded desde archivos JSON |
| **Lazy loading por ruta** | Cada pestaña es un chunk separado |

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run lint` | Ejecutar ESLint |

## Licencia

MIT
