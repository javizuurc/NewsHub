module.exports = {
  ANALISIS_NOTICIA: `
    1. Clasificación ideológica:
      - Devuelve solo una palabra: izquierdas, centro o derechas.
      - Considera tanto el enfoque del artículo como la orientación ideológica conocida del periódico en el que se publica.
      - Si la noticia no ofrece información suficiente, prioriza la orientación del medio de comunicación sobre el contenido del artículo.
      - Ten en cuenta las siguientes definiciones generales:
        - Izquierdas: defensa de políticas de redistribución, justicia social, derechos laborales, feminismo, servicios públicos.
        - Centro: equilibrio entre mercado y políticas sociales, enfoque neutral o técnico, moderación ideológica.
        - Derechas: defensa de políticas de libre mercado, seguridad, tradición, nacionalismo, reducción del gasto público.
    
    2. Temas principales:
      - Elige hasta 3 temas de esta lista:
          Política y Gobierno, Economía y Finanzas, Sociedad y Cultura, Tecnología e Innovación, Salud y Ciencia, Medio Ambiente y Cambio Climático, Seguridad y Crimen, Deportes, Entretenimiento y Espectáculos, Educación y Formación.
      - Selecciona los temas más representativos por contenido explícito o enfoque principal.
      - Si hay duda entre varios, prioriza el primero mencionado en el artículo.
    
    3. Palabras clave:
      - Asigna entre 15 y 20 palabras clave, utilizando como máximo 1 palabra por clave.
      - No incluyas los temas principales como palabras clave.
      - Si existen noticias muy similares, haz que las palabras clave coincidan entre ellas.
      - Asegúrate de que los nombres propios se mantengan unidos como una sola palabra clave (por ejemplo, María Jesús Montero debe tratarse como una única unidad).
      - Evita palabras vacías o genéricas como: caso, importante, gobierno, etc.
      - Aunque no se detecten palabras, devuelve igualmente el objeto palabras_claves con "comunes": [] y "nombres_propios": [].
      - Devuelve las palabras clave divididas en dos listas dentro de un objeto:
        {
          "comunes": [ ... ],
          "nombres_propios": [ ... ]
        }
    
    4. Justificación ideológica:
      - Proporciona al menos 3 razones objetivas basadas en:
          - Enfoque en política, economía o sociedad.
          - Figuras políticas mencionadas y el tono utilizado hacia ellas.
          - Posturas sobre políticas públicas o ideologías.
          - Si la noticia sigue o contradice la línea editorial del periódico.
      - Devuelve la justificación como una lista:
        "justificacion": [
          "Motivo 1...",
          "Motivo 2...",
          "Motivo 3..."
        ]
    
    5. Coeficiente ideológico (-6 a 6):
      - Asigna un valor entre -6 y +6 en función de la orientación ideológica.
      - El coeficiente debe derivarse de la justificación ideológica proporcionada.
      - Considera de manera prioritaria el carácter ideológico del periódico al asignar el coeficiente, sabiendo que:
          - Libertad Digital es muy de derechas,
          - El Plural es muy de izquierdas,
          - El País es centro-izquierda,
          - ABC es de derechas.
      - Los rangos son:
          - Izquierda: -3.00 a -6.00
          - Leve Izquierda: -2.99 a -1.00
          - Centro: -0.99 a +0.99
          - Leve Derecha: +1.00 a +2.99
          - Derecha: +3.00 a +6.00
    
    El resultado debe estar en formato JSON con la siguiente estructura:
    
    {
      "temas": ["tema1", "tema2", "tema3"],
      "palabras_claves": {
        "comunes": ["palabra1", "palabra2"],
        "nombres_propios": ["nombre1", "nombre2"]
      },
      "coeficiente": 5,
      "posicion": "derechas",
      "justificacion": [
        "Motivo 1...",
        "Motivo 2...",
        "Motivo 3..."
      ]
    }

    `,

    EVALUACION_URL: `
    Evalúa el sesgo ideológico del periódico basado en la siguiente URL: {URL}
    Devuelve únicamente un número entre -6 y +6, donde:
    -6 es extrema izquierda, 0 es centro, +6 es extrema derecha.
    No incluyas explicaciones ni texto adicional. Solo el número.
    `
    
};
