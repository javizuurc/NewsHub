require('dotenv').config(); // Load environment variables from .env file
const AIService = require('../app/services/aiService.js');
const prompts = require('../app/core/constants/prompts.js');

// Mock function to simulate OpenAI response
function simulateOpenAIResponse(noticia) {
  console.log("Simulando respuesta de OpenAI (sin llamada a la API)...");
  
  // Create a simulated analysis based on the news content
  const coeficiente = Math.floor(Math.random() * 13) - 6; // Random number between -6 and 6
  
  // Determine position based on coefficient
  let posicion;
  if (coeficiente >= 3) posicion = "Derecha";
  else if (coeficiente >= 1) posicion = "Leve Derecha";
  else if (coeficiente > -1) posicion = "Centro";
  else if (coeficiente > -3) posicion = "Leve Izquierda";
  else posicion = "Izquierda";
  
  // For ABC newspaper, bias the coefficient toward the right
  const ajustedCoeficiente = noticia.periodico === "abc" ? 
    Math.abs(coeficiente) > 2 ? coeficiente : Math.min(coeficiente + 2, 6) : 
    coeficiente;
  
  // Generate simulated topics
  const temasPosibles = [
    "Política y Gobierno", 
    "Economía y Finanzas", 
    "Sociedad y Cultura"
  ];
  
  // For this news article, Economics should be the main topic
  const temas = "Economía y Finanzas, Política y Gobierno";
  
  // Generate keywords related to the article
  const palabras_claves = "aranceles, Trump, crisis, económica, comercio, mundial, Unión, Europea, España, empresas, exportaciones, Sánchez, plan, medidas, proteccionismo, impacto, ABC, Müller";
  
  // Create justification based on the news content and coefficient
  const justificacion = `El artículo se publica en ABC, un medio tradicionalmente de derechas (coeficiente +3 a +6).
  
1. El enfoque económico del artículo destaca las consecuencias negativas de las políticas arancelarias de Trump, presentándolas como amenaza para la economía global.

2. Se menciona la respuesta del gobierno de Sánchez de forma crítica, calificándola como "improvisada" y señalando que utiliza "recursos sin aval de la UE", lo que muestra un sesgo contra el gobierno actual de coalición progresista.

3. El artículo proviene de un analista de ABC, medio que mantiene una línea editorial conservadora y tradicionalmente crítica con gobiernos progresistas.

Por estos motivos, se asigna un coeficiente de ${ajustedCoeficiente}, que corresponde a una posición de ${posicion}.`;

  // Simulated related news
  const noticia_relacionada = "Sánchez improvisa un plan frente a los aranceles de Trump con ayudas ya previstas y recursos sin aval de la UE";
  
  const simulatedResponse = {
    temas,
    palabras_claves,
    coeficiente: ajustedCoeficiente,
    posicion,
    justificacion,
    noticia_relacionada,
    guardado: true,
    mensaje: "Simulación completada correctamente"
  };
  
  return Promise.resolve(simulatedResponse);
}

async function testOpenAI(useSimulation = true) {
  console.log("Iniciando prueba de análisis de noticia con OpenAI...");
  
  // Ejemplo de noticia para analizar
  const noticia = {
    titulo: "El experto económico de ABC John Müller valora los aranceles de Trump: «Habrá una profunda Crisis económica»",
    subtitulo: "El presidente de Estados Unidos impuso aranceles del 10% a todo el mundo y del 20% a la Unión Europea Opinión | Descalabro en el comercio mundial, por John Müller Del jamón Cinco Jotas a Osborne, Borges o Codorníu: las empresas españolas expuestas a los aranceles Sánchez improvisa un plan frente a los aranceles de Trump con ayudas ya previstas y recursos sin aval de la UE",
    periodico: "abc",
    autor: "John Müller",
    articulo: "El analista económico de ABCJohn Müllerexamina los aranceles mundiales impuestos por Donald Trump este pasado miércoles.",
    url: "https://www.abc.es/economia/experto-analista-economico-abc-john-muller-analiza-20250403174734-nt.html",
    fecha_publicacion: "",
    fecha_scraping: new Date().toISOString(),
    temas: "",
    palabras_claves: "",
    coeficiente: "",
    posicion: "",
    justificacion: ""
  };

  
  
  try {
    const promptBase = prompts.ANALISIS_NOTICIA;
    
    let resultado;
    if (useSimulation) {
      resultado = await simulateOpenAIResponse(noticia);
      
      // Manually update the JSON file with the simulated result
      const AlmacenamientoService = require('../app/services/almacenamientoService.js');
      const storage = new AlmacenamientoService();
      const noticiaActualizada = {
        ...noticia,
        temas: resultado.temas,
        palabras_claves: resultado.palabras_claves,
        coeficiente: resultado.coeficiente,
        posicion: resultado.posicion,
        justificacion: resultado.justificacion,
        noticia_relacionada: resultado.noticia_relacionada
      };
      storage.insertarNoticiasJSON(noticiaActualizada);
    } else {
      console.log("Enviando noticia a OpenAI para análisis...");
      resultado = await AIService.datosNoticia(noticia, promptBase);
    }
    
    console.log("\n--- RESULTADO DEL ANÁLISIS ---");
    console.log(JSON.stringify(resultado, null, 2));
    console.log("-----------------------------\n");
    
    if (resultado.error) {
      console.error("❌ Error en el análisis:", resultado.error);
    } else if (resultado.guardado) {
      console.log("✅ Análisis completado y guardado correctamente");
    } else {
      console.log("⚠️ Análisis completado pero no se pudo guardar");
    }
  } catch (error) {
    console.error("Error durante la prueba:", error);
  }
}

testOpenAI(true)
  .then(() => console.log("Prueba finalizada"))
  .catch(err => console.error("Error en la prueba:", err));