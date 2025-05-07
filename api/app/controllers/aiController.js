// Si falla algo toqué las dependencias del express.js y router
const AIService = require('../services/aiService');
const fs = require('fs').promises;
const path = require('path');
const PROMPTS = require('../core/constants/prompts');
const Auxiliares = require('../core/utils/auxiliares');

// Esta función habría que hacer la prueba de si quitándola afecta a todo el programa o sólo a la noticia que no puede ser ejecutada
async function safeRequest(fn, retries = 3) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && err.response && err.response.status == 429) {
      console.log('Rate limit reached, retrying...');
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      return safeRequest(fn, retries - 1);
    } else {
      throw err;
    }
  }
}

class AIController {
  constructor() {
    this.aiService = AIService;
  }

  limpiarTexto(texto) {
    if (!texto) return texto;
      
    return texto
      .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1. $2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])([A-Z])/g, '$1 $2')
      .replace(/([.,])(?=\S)/g, '$1 ')
      .replace(/\s+/g, ' ')
      .replace(/\r?\n/g, ' ')
      .trim();
  }

  async analizarNoticias(req, res) {
    try {
      const jsonPath = path.join(__dirname, '../../data/noticias.json');
      const noticias = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

      if (!noticias || noticias.length == 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay noticias para analizar'
        });
      }

      const resultados = [];
      for (const noticia of noticias) {
        noticia.articulo  = this.limpiarTexto(noticia.articulo);
        const resultado   = await safeRequest(() => this.aiService.datosNoticia(noticia, PROMPTS.ANALISIS_NOTICIA));
        resultados.push({
          noticia: noticia.titulo,
          analisis: resultado
        });
      }

      return res.status(200).json({
        success: true,
        data: resultados
      });
    } catch (error) {
      console.error('Error al analizar noticias:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al analizar las noticias',
        error: error.message
      });
    }
  }

  async testOpenAI(req, res) {
    try {
      console.log("Iniciando prueba de análisis de noticia con OpenAI...");

      const noticia = {
        titulo: "El experto económico de ABC John Müller valora los aranceles de Trump: «Habrá una profunda Crisis económica»",
        subtitulo: "Müller analiza impacto de medidas de Trump",
        articulo: "Müller analiza en ABC el impacto de aranceles de Trump",
        autor: "Redacción Economía",
        fecha_publicacion: "2023-11-15",
        periodico: "ABC"
      };

      noticia.articulo = this.limpiarTexto(noticia.articulo);
      const resultado   = await this.aiService.datosNoticia(noticia);

      return res.status(200).json({
        success: true,
        message: "Prueba de OpenAI completada",
        data: resultado
      });
    } catch (error) {
      console.error("Error durante la prueba de OpenAI:", error);
      return res.status(500).json({
        success: false,
        message: "Error durante la prueba de OpenAI",
        error: error.message
      });
    }
  }

  async getEvaluarNoticia(req, res) {
    try {
      const aux = new Auxiliares();
      const url = req.body.url;
      console.log(req.body)

      if (!url) return res.status(400).json({ success: false, message: "URL no proporcionada" });

      if (!aux.regex.URL.test(url)) return res.status(400).json({ success: false, message: "URL inválida" });

      const prompt          = PROMPTS.EVALUACION_URL.replace('{URL}', url);
      const respuestaOpenAI = await this.aiService.evaluarURLNoticia(prompt);
      const parsed          = parseFloat(respuestaOpenAI.match(/-?\d+(\.\d+)?/)?.[0]);

      if (isNaN(parsed)) {
        return res.status(500).json({
          success: false,
          score: null,
          message: "No se pudo interpretar la respuesta de OpenAI",
          respuesta_raw: respuestaOpenAI
        });
      }

      return res.status(200).json({
        success: true,
        score: parsed
      });

    } catch (error) {
      console.error('Error al evaluar la noticia:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener la puntuación",
        error: error.message || error
      });
    }
  }
}

module.exports = new AIController();