Para el desarrollo de esta app tener en cuenta que se debe ver claramente:

- como se aborda el desarrollo de la nueva funcionalidad.
- como se mejora la experiencia del usuario.
- como se optimiza el rendimiento de una aplicación existente. 
- control de versiones y servicios en la nube (github, firebase).


Descripción de la Aplicación Base

Crea una aplicación base con una sencilla lista de tareas (To-Do List) que permite a los usuarios:

- Agregar nuevas tareas.
- Marcar tareas como completadas.
- Eliminar tareas.

La aplicación está construida con Ionic y Angular, y utiliza almacenamiento local para guardar el estado de las tareas.

Añadir la capacidad de categorizar tareas. Los usuarios deben poder:

- Crear, editar y eliminar categorías.
- Asignar una categoría a cada tarea.
- Filtrar las tareas por categoría.

Requerimientos

1. Versionamiento de la Aplicación

- Versionar la aplicación demo en un repositorio de Git:
- Crea un repositorio público en GitHub o GitLab.
- Sube la aplicación base al repositorio y realiza un commit inicial.

2. Estructura Base para Aplicación Híbrida

- Configura la estructura base para compilar la aplicación en Android e iOS:
- Asegúrate de que la aplicación puede ser compilada para ambas plataformas utilizando Cordova.
- Proporciona instrucciones claras en el archivo README para compilar y ejecutar la aplicación en dispositivos o emuladores de Android e iOS.

3. Implementación de Firebase y Remote Config

- Implementa Firebase y Remote Config:
- Configura Firebase en la aplicación desde una cuenta personal.
- Implementa una funcionalidad de feature flag utilizando Remote Config para activar o desactivar una característica específica de la aplicación.
- Proporciona una breve demostración de cómo el feature flag afecta la funcionalidad de la aplicación.

4. Optimización de Rendimiento

- Optimizar la aplicación para mejorar el rendimiento, considerando:
- La carga inicial de la aplicación.
- El manejo eficiente de grandes cantidades de tareas.
- La minimización del uso de memoria.

5. Exportación de APK e IPA

- Exporta un APK e IPA con la demo:
- Genera un archivo APK para Android y un archivo IPA para iOS con la aplicación demo configurada.
- Proporciona los archivos exportados para la evaluación final.

Entregables
1. Código fuente de la aplicación actualizado en un repositorio de Git, incluyendo un archivo README que explique cómo ejecutar la aplicación y detalle los cambios realizados.
2. Capturas de pantalla o grabaciones de video que muestren las nuevas funcionalidades en acción.
3. Respuestas a las siguientes preguntas:
- ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?
- ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
- ¿Cómo aseguraste la calidad y mantenibilidad del código?
4. Archivos APK e IPA generados a partir de la aplicación demo.

Criterios de Evaluación
- Funcionalidad: La aplicación debe cumplir con todos los requerimientos especificados.
- Calidad del Código: El código debe ser limpio, organizado y bien documentado.
- Experiencia de Usuario: La aplicación debe ofrecer una experiencia de usuario intuitiva y atractiva.
- Rendimiento: La aplicación debe ser rápida y eficiente en el manejo de datos.
- Creatividad e Innovación: Se valorará cualquier mejora adicional que proponga y desarrolle.
- Versionamiento y Configuración en la Nube: Correcta implementación de Git y Firebase.

Instrucciones de Entrega
- Realiza un fork del repositorio y desarrolla tus cambios en una nueva rama.
- Envía el enlace a tu repositorio con los cambios realizados antes de la fecha límite especificada.
- Proporciona los enlaces de descarga para los archivos APK e IPA generados.
