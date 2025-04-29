# Mejoras de la API
1. Todas las rutas a otros ficheros deberían de estar en un archivo en /app/config llamado path.js. Hacer un diccionario y separar por controladores, dependencias, servicios...
2. Este tipo de mensajes:
    return res.status(400).json({
                    success: false,
                    message: 'No hay noticias para analizar'
                });
deberían de estar en una clase que los maneje (optimización)
3. Crear clases genéricas (modelo, router, services, controller)
4. Eliminar elementos innecesarios de las funciones.
### aiController:

### almacenamientoController
Revisar donde uso la función crearJSON

### noticiasController
Ahora los métodos para las select hacerlo un método de la bbdd, no de las noticias. Noticias las debe de heredar.

### auxiliares.js
1. Tiene funciones como mirar si existe en la bbdd (debería de usarla para insertar las palabras claves en la bbdd)
2. Funciones llamadas noticiaExisteBBDD y noticiaExiste con el mismo propósito (simplificar).

## Database
Crear una clase modelo (para las tablas de la bbdd) en la que luego en el constructor se defina lo que es cada modelo.

### db.js
1. Tanto la función modelo como buscar duplicados. Verificar si tienen que ver con auxiliares o no.
2. Los modules exports están mal hechos (debería de exportarse sólo en singleton)

### seeders
1. Crear una funicón para hacer los inserts, para insertar lo que se necesita.

## Routes

