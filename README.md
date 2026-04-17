# TaskFlow 📋 — Versión Extendida

Aplicación móvil de gestión de tareas con categorías, búsqueda avanzada y feature flags, construida con **Ionic 8**, **Angular 20**, **Cordova** y **Firebase Remote Config**.

Esta es la versión extendida (fork) que agrega funcionalidades avanzadas sobre la [app base](https://github.com/gelver92x/TaskFlow-Ionic/tree/main).

> **Nota para la Evaluación Técnica:**  
> - El **video de demostración** y el documento con las **respuestas de la prueba** se encuentran disponibles en esta [carpeta de Google Drive](https://drive.google.com/drive/u/4/folders/1OF6yIN47HiDvwPP_DBQx0-4X9SRvAbLJ).  
> - Los archivos compilados (**APK** para Android e **IPA** para iOS) solicitados están alojados en la sección de [Releases](https://github.com/gelver92x/TaskFlow-Pro/releases) de este repositorio.

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
- ✅ **Almacenamiento nativo** — NativeStorage (SharedPreferences / UserDefaults) con fallback a localStorage
- ✅ **Componentes standalone** — Sin NgModules, imports individuales de Ionic
- ✅ **Compilación nativa** — Cordova para generar APK (Android) e IPA (iOS)

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| [Ionic Framework](https://ionicframework.com/) | 8.x | Componentes UI móviles |
| [Angular](https://angular.dev/) | 20.x | Framework frontend |
| [Cordova](https://cordova.apache.org/) | 13.x (Android) / 7.x (iOS) | Motor de compilación nativa |
| [Firebase](https://firebase.google.com/) | 11.x | Remote Config / Feature Flags |
| [cordova-plugin-nativestorage](https://github.com/nicovank/NativeStorage) | 2.x | Almacenamiento nativo persistente |
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
│   │   │       └── task-form-modal/    # Modal de creación de tareas
│   │   │
│   │   ├── categories/
│   │   │   ├── category-list/          # Página de categorías
│   │   │   └── components/
│   │   │       └── category-form-modal/  # Modal con color/icon picker
│   │   │
│   │   └── settings/                   # Página de ajustes
│   │       ├── settings.page.ts
│   │       ├── settings.page.html
│   │       └── settings.page.scss
│   │
│   ├── services/
│   │   ├── storage.service.ts          # NativeStorage (nativo) + localStorage (web)
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

config.xml                              # Configuración Cordova (plugins, plataformas)
ionic.config.json                       # Configuración Ionic (integración Cordova)
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
- **Cordova CLI** (`npm install -g cordova`)
- **ios-deploy** (`npm install -g ios-deploy` - requerido para emular y compilar en macOS para iOS)
- **Ionic CLI** (opcional, vía npx)

Para compilación nativa:
- **Android Studio** + Android SDK 34+ + Build Tools (para Android)
- **Xcode** 15+ + CocoaPods (para iOS — solo macOS)
- **Java JDK** 17+

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/gelver92x/TaskFlow-Pro.git
cd TaskFlow-Pro

# Instalar dependencias
npm install

# Agregar plataformas Cordova
cordova platform add android
cordova platform add ios    # Solo en macOS
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

# Compilar APK de debug
cordova build android

# El APK se genera en:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Para compilar en **Android Studio**:
1. Abre `platforms/android` como proyecto
2. Espera a que Gradle sincronice
3. Selecciona un dispositivo/emulador
4. Haz clic en **Run** (▶)

### iOS (solo macOS)

```bash
# Compilar assets web
npx ng build --configuration production

# Ejecutar en simulador iOS (asegúrate de usar un target que tengas instalado)
cordova emulate ios --target="iPhone-17-Pro"

# O solo compilar proyecto iOS
cordova build ios

# Abrir en Xcode
open platforms/ios/TaskFlow.xcworkspace
```

En Xcode:
1. Selecciona un simulador o dispositivo
2. Configura el equipo de firma (Signing & Capabilities)
3. Haz clic en **Run** (▶)

### Generar APK firmado (Release)

```bash
# Build de producción
npx ng build --configuration production

# APK release (requiere keystore)
cordova build android --release -- --keystore=taskflow.keystore --alias=taskflow

# El APK firmado se genera en:
# platforms/android/app/build/outputs/apk/release/app-release.apk
```

### Generar IPA (solo macOS)

```bash
npx ng build --configuration production
cordova build ios --release

# Abrir en Xcode para archivo:
# Product > Archive > Distribute App
```

## Decisiones de Arquitectura

| Decisión | Justificación |
|---|---|
| **Standalone Components** | Angular 17+ best practice, maximiza tree-shaking eliminando NgModules |
| **NativeStorage** | Almacenamiento persistente vía plugin Cordova con SharedPreferences (Android) y UserDefaults (iOS) |
| **Feature-based structure** | Carpetas por funcionalidad (tasks/, categories/, settings/) |
| **ion-tabs + ion-tab-bar** | Patrón de navegación nativo estándar en iOS y Android |
| **BehaviorSubject** | Flujo reactivo con limpieza automática vía async pipe |
| **Firebase Remote Config** | Feature flags sin publicar nuevas versiones |
| **TranslateHttpLoader** | i18n lazy-loaded desde archivos JSON |
| **Lazy loading por ruta** | Cada pestaña es un chunk separado |
| **Cordova** | Motor de compilación nativa requerido para generar APK e IPA |

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run lint` | Ejecutar ESLint |
| `cordova build android` | Compilar APK para Android |
| `cordova build ios` | Compilar proyecto para iOS |

## Licencia

MIT
