# Mejoras NewsHub de cara a la presentación
## Estética
- Cambiar las tipografías.
### Home
- Tamaño de la pantalla (el scrollbar me molesta muchísimo), la aplicación debería de verse en el 100% de la pantalla, nada más.
- El borde de cada uno de los grupos centrales debería de ser de otro color (por definir siguiendo la paleta de colores).
- Revisar los iconos en el footer (ver si valen la pena así o no).
- Debajo de los tópicos queda un hueco en blanco, valorar si poner algo ahí o no.
- El contenido central, tras separar lo que son los componentes de grupos de el section, el título de 'noticias relevantes' se ve más pequeño, deberíamos de corregir eso para que tenga todo el mismo tamaño.

### Componentes
- Hacer que los endpoints recarguen cada cierto tiempo (pero que no sea el mismo para que no se recargue la web entera).
#### TopicsAside
- Al hacer AJAX a 2 URL, usar multitrheading para hacerlo a mayor velocidad
#### NavMenuComponent
- El modal que tenga el botón rojo.
- Centrar mejor el contenido del Nav.
- Sino recuerdo mal, hay una nueva forma de abrir los modales (revisar si ya está implementada).
- Mejorar el menú para móvil (no funciona).

#### TopicSection
- Ver para que sirve, sino para fuera.

#### Modals
- Crear un componente llamado BaseModal(optimizar código), sobre todo si vamos a mirar la nueva forma de abrir un modal.

#### Thermometers
- Dudo que se usen los tres ficheros que hay dentro. Ver cuál se usa y cual no (para elimianr lo demás).

### Views
- Ver porque cuando pongo una página que no existe no se pone el 404, sino el por defecto del navegador.