const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const fs = require('fs').promises;
const path = require('path');
const PROMPTS = require('../core/constants/prompts');

async function safeRequest(fn, retries = 3) {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0 && err.response && err.response.status === 429) {
        console.log('Rate limit reached, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        return safeRequest(fn, retries - 1);
      } else {
        throw err;
      }
    }
  }
  
 
  function limpiarTexto(texto) {
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


  
class AIController {
    constructor() {
        this.aiService = AIService;
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
                noticia.articulo = limpiarTexto(noticia.articulo); 
                const resultado = await safeRequest(() => this.aiService.datosNoticia(noticia, PROMPTS.ANALISIS_NOTICIA));
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
                subtitulo: "El periodista analiza el impacto de las medidas proteccionistas anunciadas por el presidente electo de Estados Unidos",
                articulo: "El periodista y experto económico John Müller ha analizado en ABC el impacto que tendrán los aranceles anunciados por Donald Trump tras su victoria electoral. Según Müller, estas medidas proteccionistas provocarán \"una profunda crisis económica\" que afectará tanto a Estados Unidos como a sus socios comerciales.\n\nMüller explica que \"los aranceles del 10% a todos los productos importados y del 60% a los productos chinos supondrán un aumento de precios para los consumidores estadounidenses y una probable guerra comercial con represalias por parte de China y la Unión Europea\".\n\nEl experto señala que \"la historia económica nos ha enseñado que el proteccionismo acaba perjudicando a quien lo impone\" y recuerda el precedente de la Gran Depresión, cuando medidas similares agravaron la Crisis económica mundial.\n\nEn su análisis, Müller también advierte sobre el impacto en España: \"Nuestra economía, dependiente de las exportaciones a Estados Unidos en sectores como el agroalimentario, sufrirá un golpe considerable si estos aranceles se materializan\".",
                autor: "Redacción Economía",
                fecha_publicacion: "2023-11-15",
                periodico: "ABC"
            };

            noticia.articulo = limpiarTexto(noticia.articulo);
            const resultado = await this.aiService.datosNoticia(noticia);
            
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
}

module.exports = new AIController();