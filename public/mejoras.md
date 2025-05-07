# Mejoras NewsHub de cara a la presentación
## Estética
- Centrarnos sólo en la estética para ordenadores y móviles (fuera tamaños de pantalla medianos).
- Cambiar las tipografías.
### Home
- Tamaño de la pantalla (el scrollbar me molesta muchísimo), la aplicación debería de verse en el 100% de la pantalla, nada más.
- El borde de cada uno de los grupos centrales debería de ser de otro color (por definir siguiendo la paleta de colores).
- Revisar los iconos en el footer (ver si valen la pena así o no).
- Debajo de los tópicos queda un hueco en blanco, valorar si poner algo ahí o no.
- El contenido central, tras separar lo que son los componentes de grupos de el section, el título de 'noticias relevantes' se ve más pequeño, deberíamos de corregir eso para que tenga todo el mismo tamaño.

### Estadísticas
- Mejorar el layout de las estadísticas.
- Que los colores se adecuen a los de la web.

### Nosotros
- Terminar la tarjeta de Manu.
- Crear descripciones asequibles.
- Las tarjetas debajo de la descripción pensar utilidad (sino fuera).

## Funcionalidad
- Ver porque tenemos un fichero en la raíz del proyecto llamado sync.js y porque está ahí.
- Eliminar todos los console log de cara a la web (eso era depuración que ya no hace falta).
### Assets
- Mejorar el nombre de donde guardamos nuestras fotos.
- Los logos podrían ir en /public (ver si necesitamos en renderizado y la mejora de vite).
### Componentes
- Quitarles el GPT a los que den indicio de ello
- Crea un componente para los texto de error (para así rehusar código)
- Hacer que los endpoints recarguen cada cierto tiempo (pero que no sea el mismo para que no se recargue la web entera).
#### TopicsAside
- Al hacer AJAX a 2 URL, usar multitrheading para hacerlo a mayor velocidad
#### NavMenuComponent
- El modal que tenga el botón rojo.
- Centrar mejor el contenido del Nav.
- Sino recuerdo mal, hay una nueva forma de abrir los modales (revisar si ya está implementada).
- Mejorar el menú para móvil (no funciona).
#### SectionComponent
- Revisar que todo lo que se pone dentro ocupe el tamaño que necesite (esto es más por los componentes que entran en este que un problema en sí del componente).
#### TopicSection
- Ver para que sirve, sino para fuera.

#### Modals
- Crear un componente llamado BaseModal(optimizar código), sobre todo si vamos a mirar la nueva forma de abrir un modal.

#### Tags
- Crear el componente NosotrosTag (que es lo que se usa debajo de las descripciones).

#### Thermometers
- Dudo que se usen los tres ficheros que hay dentro. Ver cuál se usa y cual no (para elimianr lo demás).

### Views
- Ver porque cuando pongo una página que no existe no se pone el 404, sino el por defecto del navegador.

## API

### Controllers
- Tratar de quitarle todo el vibeCoding que tienen
#### AlmacenamientoController
- Ver si las funciones que están ahí se usan todas (sino eliminar porque para nada están).
#### NoticiasController
- Cuando vas a hacer grupos, que consulte si alguna de las noticias pueden ir en algún grupo existente ya.

### Constants
#### Querys
- Ajustar las querys según el tiempo. Por ejemplo, los grupos deberían de hacerse de los últimos 3-7 días, mientras que los tópicos diarios deberían de ser del último día.

### Services
- Tratar de quitarle todo el vibeCoding que tienen

### Grupos
- Tratar de quitarle todo el vibeCoding que tienen