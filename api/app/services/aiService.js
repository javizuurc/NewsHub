const axios = require('axios');
const Auxiliares = require('../core/utils/auxiliares.js');
const AlmacenamientoService = require('./almacenamientoService.js');
const prompts = require('../core/constants/prompts.js');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = "gpt-4";
    this.almacenamientoService = new AlmacenamientoService();
  }

  verificarAPI() {
    return Auxiliares.verificarApiKey();
  }

  cortarTexto(texto, maxCaracteres) {
    if (!texto) return '';
    return texto.length <= maxCaracteres ? texto : texto.substring(0, maxCaracteres) + '...';
  }

  async datosNoticia(noticia) {
    try {
      const apiKeyError = this.verificarAPI();
      if (apiKeyError) return apiKeyError;

      if (!noticia) {
        const resultado = this.almacenamientoService.leerNoticiasJSON();
        if (!resultado.success || !resultado.data.length) {
          return {
            error: 'No hay noticias disponibles',
            mensaje: resultado.message
          };
        }
        noticia = resultado.data[resultado.data.length - 1];
      }

      const articuloCortado = this.cortarTexto(noticia.articulo, 3000);

      const messages = [
        {
          role: "system",
          content: prompts.ANALISIS_NOTICIA
        },
        {
          role: "user",
          content: `Título: ${noticia.titulo}\n` +
                   (noticia.subtitulo ? `Subtítulo: ${noticia.subtitulo}\n` : '') +
                   (noticia.autor ? `Autor: ${noticia.autor}\n` : '') +
                   `Periódico: ${noticia.periodico || 'No especificado'}\n` +
                   `\nContenido:\n${articuloCortado}\n`
        }
      ];

      const tokensEstimados = Auxiliares.estimarTokens(messages[1].content);
      console.log(`Tokens estimados para esta noticia: ${tokensEstimados}`);

      console.log("Llamando a OpenAI API...");
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: this.model,
        messages: messages,
        max_tokens: 4000,
        temperature: 0.3
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 60000
      });

      console.log("Respuesta recibida de OpenAI");

      if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        console.error("Error: Respuesta de OpenAI con formato inesperado", response.data);
        return {
          error: "Error: Formato de respuesta inesperado de OpenAI",
          titulo: noticia.titulo
        };
      }

      const respuestaIA = response.data.choices[0].message.content;
      const analisisJSON = Auxiliares.simplificarJSON(respuestaIA);
      const analisisData = analisisJSON;

      console.log("Análisis completo recibido:", JSON.stringify(analisisJSON, null, 2));
      console.log("Análisis de la noticia (analisisData):", JSON.stringify(analisisData, null, 2));
      console.log("Palabras claves comunes:", analisisData.palabras_claves?.comunes);
      console.log("Palabras claves nombres propios:", analisisData.palabras_claves?.nombres_propios);
      
      const noticiaActualizada = {
        ...noticia,
        coeficiente: analisisData.coeficiente,
        justificacion: analisisData.justificacion || analisisData.explicacion || analisisData.analisis,
        posicion: analisisData.posicion || noticia.posicion || '',
        temas: analisisData.temas || noticia.temas || [],
        palabras_claves: {
            comunes: analisisData.palabras_claves?.comunes || [],
            nombres_propios: analisisData.palabras_claves?.nombres_propios || []
        }
      };
    

      console.log("Guardando resultados del análisis en el JSON...");
      const resultadoGuardado = this.almacenamientoService.insertarNoticiasJSON(noticiaActualizada);

      if (resultadoGuardado.success) {
        console.log(`Análisis guardado: ${resultadoGuardado.message}`);
        return {
          ...analisisJSON,
          guardado: true,
          mensaje: resultadoGuardado.message
        };
      } else {
        console.warn(`No se pudo guardar el análisis: ${resultadoGuardado.message}`);
        return {
          ...analisisJSON,
          guardado: false,
          mensaje: resultadoGuardado.message
        };
      }

    } catch (error) {
      console.error("Error al llamar a OpenAI:");
      if (error.response) {
        console.error("Datos de respuesta:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
        console.error("Cabeceras:", error.response.headers);
      } else if (error.request) {
        console.error("No se recibió respuesta:", error.request);
      } else {
        console.error("Error de configuración:", error.message);
      }

      return {
        error: "Error al procesar esta noticia con OpenAI: " + (error.response ? error.response.status : error.message),
        titulo: noticia.titulo || 'Sin título'
      };
    }
  }




  async evaluarURLNoticia(prompt) {
    try {
      const apiKeyError = this.verificarAPI();
      if (apiKeyError) return apiKeyError;
  
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: this.model,
        messages: [
          { role: prompts.EVALUACION_URL },
          { role: "user", content: prompt }
        ],
        max_tokens: 20,
        temperature: 0.2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 30000
      });
  
      if (!response.data?.choices?.[0]?.message?.content) {
        console.error("Respuesta inesperada:", response.data);
        return { error: "Formato inesperado de respuesta de OpenAI" };
      }
  
      return response.data.choices[0].message.content.trim();
  
    } catch (error) {
      console.error("Error al llamar a OpenAI desde evaluarURLNoticia:");
  
      if (error.response) {
        console.error("Respuesta con error:", error.response.data);
        return { error: "Respuesta inválida de OpenAI", detalle: error.response.data };
      } else if (error.request) {
        console.error("No hubo respuesta:", error.request);
        return { error: "No hubo respuesta de OpenAI" };
      } else {
        console.error("Error inesperado:", error.message);
        return { error: "Error inesperado: " + error.message };
      }
    }
  }
  
  
}

module.exports = new AIService();