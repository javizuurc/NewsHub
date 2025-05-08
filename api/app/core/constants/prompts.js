module.exports = {
  ANALISIS_NOTICIA: `
    1. Ideología (izquierdas/centro/derechas):
      - Evalúa enfoque del artículo y orientación del medio
      - Si hay dudas, prioriza orientación del medio
      - Izquierdas: redistribución, justicia social, derechos laborales
      - Centro: equilibrio mercado-social, neutralidad
      - Derechas: libre mercado, seguridad, tradición, menos gasto público

    2. Temas (máximo 3):
      Política/Gobierno, Economía/Finanzas, Sociedad/Cultura, Tecnología, Salud/Ciencia, 
      Medio Ambiente, Seguridad/Crimen, Deportes, Entretenimiento, Educación.
      Priorizar primer tema mencionado si hay dudas.

    3. Keywords (15-20):
      - Una palabra por clave
      - Excluir temas principales
      - Mantener nombres propios unidos
      - Evitar palabras genéricas
      - Formato: {"comunes":[], "nombres_propios":[]}

    4. Justificación (mínimo 3):
      - Enfoque político/económico/social
      - Tono hacia figuras políticas
      - Posturas ideológicas
      - Alineación con línea editorial

    5. Coeficiente (-6 a +6):
      -En base al artiulo(ten en cuenta tambíen la idelogía del periodico) y dame un coeficiente númerico siendo:
      - Ultra-Izquierda: -5.00 a -6.00
      - Izquierda: -2 a -4.99
      - Leve Izquierda: -1 a -1.99
      - Centro: -0.99 a +0.99
      - Leve Derecha: +1.00 a +1.99
      - Derecha: +2.00 a +4.99
      - Ultra-Derecha: +5.00 a +6.00

    Devolver JSON:
    {
      "temas": ["tema1", "tema2", "tema3"],
      "palabras_claves": {
        "comunes": [],
        "nombres_propios": []
      },
      "coeficiente": 5,
      "posicion": "derechas",
      "justificacion": [
        "Motivo 1",
        "Motivo 2",
        "Motivo 3"
      ]
    }
  `,

  EVALUACION_URL: `
    Evalúa el sesgo ideológico del periódico basado en la siguiente URL: {URL}
    Devuelve únicamente un número entre -6 y +6, donde:
      - Izquierda: -6.00 a -3.00
      - Leve Izquierda: -2.99 a -1.00
      - Centro: -0.99 a +0.99
      - Leve Derecha: +1.00 a +2.99
      - Derecha: +3.00 a +6.00
    No incluyas explicaciones ni texto adicional. Solo el coeficiente asociado.
  `
};
