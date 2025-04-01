# NewsHub

## Fase de análisis: 
### ¿Qué es NewsHub?
NewsHub es una **Aplicación Web** innovadora cuyo objetivo principal es **recopilar, analizar y representar** información sobre noticias y temas de diferentes fuentes de periódicos, tomando en cuenta la ideología o sesgo informativo de cada medio. La aplicación permite a los usuarios **comparar cómo diferentes medios de comunicación cubren la misma noticia o tema, identificando el posicionamiento de los medios y proporcionando un análisis sobre el sesgo ideológico** presente en las informaciones.

El propósito de NewsHub es **facilitar el acceso a múltiples perspectivas sobre una misma noticia**, permitiendo a los usuarios obtener una **visión más objetiva y equilibrada** de los eventos. De esta manera, el proyecto busca **contribuir a una mejor comprensión de cómo los medios informan** y, potencialmente, reducir el impacto del sesgo mediático.

En un mundo en constante cambio, NewsHub **informa a los usuarios de manera eficiente**, ahorrando tiempo al eliminar la necesidad de consultar múltiples periódicos individualmente y proporcionando una visión completa y diversa sobre un tema determinado.

### Objetivos:

1. **Recopilar información** sobre noticias de diversas fuentes periodísticas, con especial enfoque en diferentes ideologías y enfoques informativos. Para ello, haremos **Web Scraping manual** de diversos medios nacionales.

    1.1 **Periódicos de izquierdas:** El País, El Plural, El Diario.

    1.2 **Periódicos de derechas:** ABC, La Vanguardia, LibertadDigital.

2. **Identificar el sesgo ideológico** en cada noticia a través de un análisis de las fuentes y sus tendencias (por ejemplo, de izquierda, derecha, o centrado). Además, indagaremos cómo los periódicos tratan diversos temas en función de sus ideales.

3. **Facilitar la comparación de la cobertura de una misma noticia o tema entre diferentes medios**, brindando un análisis claro sobre las diferencias y similitudes en la información. Los periódicos se clasificarán por diversos parámetros (ideológicos, público objetivo, inversores, etc.).

4. **Promover el acceso a la información de manera objetiva**, ayudando a los usuarios a reconocer y cuestionar los sesgos presentes en los medios de comunicación. Para ello, utilizaremos herramientas de análisis y **Inteligencia Artificial** para interpretar la información de la manera más objetiva posible.

### Análisis de requisitos del software
#### Definir el alcance del proyecto
#### Identificación del público objetivo
La idea de NewsHub es **llegar a un público amplio**, aunque reconocemos que **la búsqueda proactiva de información suele ser realizada por un grupo minoritario**. Nuestro objetivo es **facilitar el acceso a la información** de manera que cualquier persona con un dispositivo inteligente y conexión a internet pueda utilizarla.

Aunque queremos que el proyecto sea accesible para todos, también buscamos que sea rentable en el futuro. Por ello, implementaremos un sistema de suscripciones mensuales para aquellos usuarios que deseen un **análisis más profundo** de los temas más relevantes.

#### Documentar los requisitos del público objetivo
Nuestra plataforma se basa en el **contraste de información de diversos periódicos**, realizando un análisis estadístico y estudios sobre sus noticias. Tras esta primera fase, identificamos temas comunes en los periódicos y aplicamos los análisis para representar la realidad de los medios, permitiendo al usuario observar si una noticia está sesgada y facilitando su posicionamiento crítico.

Tras un análisis del público objetivo, hemos identificado los siguientes patrones en cuanto a preferencias y preocupaciones:

- **Consumo de noticias:** Frecuencia, medios preferidos, tiempo dedicado.
- **Temas de interés:** Economía, política, salud, tecnología, deportes, cultura, etc.
- **Satisfacción con los medios:** Críticas comunes como publicidad excesiva, noticias falsas, falta de imparcialidad.
- **Verificación de noticias:** Métodos de verificación y confianza en la información.
- **Perfil socioeconómico:** Edad, situación laboral, nivel de ingresos, nivel de estudios.

###### Perfil socioeconómico
- **Edad:** (15-25, 25-35, 35-45, 45-55, más de 55).
- **Situación laboral:** (Estudiante, Asalariado, Empresario, Pensionista, Desempleado).
- **Nivel de ingresos:** (menos de 6000€, 6000€-12000€, 12001€-30000€, más de 30000€).
- **Nivel de estudios:** (ESO, Bachillerato, Ciclo Superior, Universidad, Máster).

#### Agrupar los requisitos
##### Consumo de noticias
- **Frecuencia de consumo:** (diario, semanal, esporádico).
- **Medios preferidos:** (televisión, radio, periódicos digitales, redes sociales).
- **Tiempo dedicado a informarse:** (10-20 minutos, más de 20 minutos).

##### Temas de interés
_Economía, política, salud, tecnología, deportes, cultura, actualidad local._

##### Satisfacción con los medios
**Críticas comunes:** publicidad excesiva, noticias falsas, falta de imparcialidad, clickbait.

**Necesidad de contrastar información con múltiples fuentes.**

##### Verificación de noticias
**Métodos de verificación:** (contrastar con otros medios, consultar fuentes oficiales, uso de redes sociales).

Confianza en la información consumida.

#### Documentar requisitos
##### Requisitos funcionales

- **Contraste de noticias:** Permitir a los usuarios comparar noticias de diferentes fuentes.  
  **Ejemplo:** Un usuario puede ver cómo El País y ABC cubren la misma noticia sobre política, identificando diferencias en el enfoque y el lenguaje utilizado.

- **Análisis estadístico:** Ofrecer análisis estadísticos sobre tendencias, sesgos y cobertura de temas actuales.  
  **Ejemplo:** Un gráfico que muestre cómo los medios de izquierda y derecha cubren temas económicos en los últimos 6 meses.

- **Personalización:** Permitir a los usuarios seleccionar temas de interés.  
  **Ejemplo:** Un usuario puede configurar alertas para recibir noticias sobre tecnología y deportes.

##### Requisitos no funcionales

- **Usabilidad:** Interfaz intuitiva y fácil de usar.
- **Rendimiento:** Plataforma rápida y eficiente, preparada para recibir grandes volúmenes de datos.
- **Seguridad:** Garantizar la privacidad y seguridad de los datos de los usuarios.
- **Escalabilidad:** Capacidad para manejar un crecimiento en el número de usuarios y noticias.

##### Requisitos de contenido

- **Diversidad de fuentes:** Incluir una amplia variedad de fuentes de noticias.
- **Actualización en tiempo real:** Mantener las noticias actualizadas con una frecuencia que permita estar informado.

#### Validar requisitos
- **Pruebas de usabilidad:** Observar cómo los usuarios interactúan con la plataforma.
- **Pruebas de rendimiento:** Asegurar que la plataforma maneje grandes volúmenes de datos.
- **Encuestas de satisfacción:** Recopilar feedback sobre la calidad de las noticias y herramientas de análisis.
- **Pruebas unitarias:** Comprobar el manejo de errores en el código y la robustez del mismo.

#### Priorizar requisitos
##### Alta prioridad
- **Contraste de noticias y verificación de fuentes.**
- **Análisis estadístico y visualización de datos.**
- **Personalización de temas de interés y alertas de noticias.**

##### Media prioridad
- **Diversidad de fuentes.**
- **Usabilidad y diseño de la interfaz.**

##### Baja prioridad
- **Escalabilidad y rendimiento.**
- **Obtener noticias en tiempo real.**

### Diagrama de casos de uso
#### Actores
- **Usuario:** Persona que **consume noticias** y utiliza la plataforma para contrastar información.
- **Administrador:** Persona responsable de **gestionar las fuentes de noticias y el contenido de la plataforma**.

#### Casos de uso
- **Filtrar noticias:** El usuario puede filtrar noticias por tópicos diarios, semanales o personalizados.
- **Contrastar noticias:** El usuario puede comparar noticias de diferentes fuentes.
- **Verificar noticias:** El usuario puede verificar la veracidad de una noticia contrastando con otras fuentes.
- **Gestionar fuentes (Administrador):** El administrador puede agregar, eliminar o actualizar las fuentes de las noticias.

## Fase de diseño
### Diagrama de clases
### Diagrama Entidad - Relación
### Estructura de la Base de datos
### Pantallas de diseño de nuestra aplicación
En nuestra aplicación, la paleta de colores que vamos a emplear es una escala de grises, combinada con oro y plata para darle un aspecto más premium.

**Uso ideal:** Para una web minimalista y elegante.

**Aplicación:**
- **Fondo:** Gris claro (#D9D9D9) o blanco (#FFFFFF) para las secciones principales.
- **Texto:** Gris oscuro (#2C2C2C) para el cuerpo del texto, asegurando legibilidad.
- **Acentos:** Oro (#FFD700) para botones de llamada a la acción (CTA), iconos destacados o bordes. Plata (#C0C0C0) para elementos secundarios, como líneas divisorias o iconos menos relevantes.
- **Header/Footer:** Gris medio (#5A5A5A) para contraste y estructura.

## Códificación
### Stack Tecnológico:
Para el desarrollo de la Aplicación Web, utilizaremos las siguientes tecnologías:
- **Análisis de datos y Web scraping:** Python.
- **Estructuración de datos:** SQL.
- **Manejo de datos entre la base de datos y la API:** Express.js.
- **Parte visual de la web:** Vue, JavaScript, HTML y CSS (Tailwind y Bootstrap Icons).


#### Propuestas de mejora
- **Configurar plantillas:** Para configurar plantillas usaremos EJS.
- **Creación de la bases de datos:** Como si se tratara del ORM Eloquent que trae Laravel, disponemos de dos librerías: peewee(python) y seequelize(javascript)

## Pruebas del código
### Pasos para instalar la API
```bash
node express.js
# (y se ejecuta el main.py)

npm install axios