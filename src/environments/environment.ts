/**
 * Configuración de entorno para desarrollo.
 *
 * Este archivo contiene las credenciales de Firebase y configuraciones
 * específicas del entorno de desarrollo.
 *
 * INSTRUCCIONES para configurar Firebase:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto (o selecciona uno existente)
 * 3. En la configuración del proyecto, agrega una app web
 * 4. Copia las credenciales de Firebase y reemplaza los valores a continuación
 * 5. En la consola de Firebase, activa Remote Config:
 *    - Ve a "Engage > Remote Config"
 *    - Crea los siguientes parámetros:
 *      * categories_enabled (boolean) = true
 *      * priorities_enabled (boolean) = true
 *      * banner_message (string) = ""
 *    - Publica los cambios
 */
export const environment = {
  production: false,

  /**
   * Credenciales de Firebase.
   *
   * IMPORTANTE: Reemplaza estos valores con los de tu proyecto.
   * Puedes encontrarlos en Firebase Console > Configuración del proyecto > Tus apps.
   */
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'tu-proyecto.firebaseapp.com',
    projectId: 'tu-proyecto',
    storageBucket: 'tu-proyecto.firebasestorage.app',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef123456',
  },
};
