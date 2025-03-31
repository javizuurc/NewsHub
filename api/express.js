//Instalación de dependencias
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;

const dbConfig = require('./database/config_db.js');
const bodyParser = require('body-parser');

//Hay que tener en cuenta para el prompt que si no se cuenta con grandes cantidades de información 
// en la noticia. Se debería de fijar más en el periódico que redacta la noticia en vez de toda 
// la noticia en conjunto.
const promptBase = `
    1. Clasificación ideológica:
    - Devuelve solo una palabra: izquierdas, centro o derechas.
    - Considera tanto el enfoque del artículo como la orientación ideológica conocida del periódico en el que se publica.
    - Si la noticia no ofrece información suficiente, prioriza la orientación del medio de comunicación sobre el contenido del artículo.

    2. Temas principales:
    - Elige hasta 3 temas de esta lista:
        Política y Gobierno, Economía y Finanzas, Sociedad y Cultura, Tecnología e Innovación, Salud y Ciencia, Medio Ambiente y Cambio Climático, Seguridad y Crimen, Deportes, Entretenimiento y Espectáculos, Educación y Formación.

    3. Palabras clave:
    - Asigna entre 15 y 20 palabras clave, utilizando como máximo 1 palabra por clave.
    - No incluyas los temas principales como palabras clave.
    - Si existen noticias muy similares, haz que las palabras clave coincidan entre ellas.
    - Asegúrate de que los nombres propios se mantengan unidos como una sola palabra clave (por ejemplo, "María Jesús Montero" debe tratarse como una única unidad).
    - Devuelve únicamente las palabras clave separadas por comas.

    4. Justificación ideológica:
    - Proporciona al menos 3 razones objetivas basadas en:
        - Enfoque en política, economía o sociedad.
        - Figuras políticas mencionadas y el tono utilizado hacia ellas.
        - Posturas sobre políticas públicas o ideologías.
        - Si la noticia sigue o contradice la línea editorial del periódico.

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
        "temas":              "RESPONSE",
        "palabras_claves":    "RESPONSE",
        "coeficiente":        "RESPONSE",
        "posicion":           "RESPONSE",
        "justificacion":      "RESPONSE",
        "noticia_relacionada": "RESPONSE"
    }
`;

// Importar los modelos de Sequelize
const { Noticia, Periodico, Tema, syncModels } = require('./database/models');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

// Crear conexión a partir del archivo config_db.js
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
});

connection.connect((err) => {
    if (err) {
        console.error('La aplicación se cerrará debido a un error de conexión a la base de datos');
        process.exit(1); // Termina la aplicación con código de error
    }
    console.log('Conexión exitosa a la base de datos');
});

let noticias = [];

/*
############
## LÓGICA ##
############
*/

const noticiaExiste = (nuevaNoticia) => { // Verifica si una noticia ya existe en el array
    return noticias.some(noticia => 
        noticia.url == nuevaNoticia.url || 
        noticia.titulo == nuevaNoticia.titulo
    );
};

const simplificarJSON = (respuesta) => { // Comprobar que esto sea útil realmente
    try {
        let jsonLimpio = respuesta.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonLimpio);
    } catch (error) {
        return { error: "Error al parsear la respuesta de OpenAI." };
    }
};

const estimarTokens = (texto) => {
    return Math.ceil(texto.length / 4);
};

const resumenNoticia = async (noticia, promptBase) => {
    let prompt = promptBase;
    prompt += `Título: ${noticia.titulo}\n`;
    prompt += `Subtítulo: ${noticia.subtitulo}\n`;
    prompt += `Artículo: ${noticia.articulo}\n\n`;

    const totalTokens = estimarTokens(prompt);
    console.log(`Tokens estimados para esta noticia: ${totalTokens}`);

    if (totalTokens > 128000)
        return {
            error: `La noticia excede el límite de 128,000 tokens. Tokens estimados: ${totalTokens}`,
            titulo: noticia.titulo
        };

    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: No se ha configurado la API key de OpenAI");
            return {
                error: "Error de configuración: API key de OpenAI no disponible",
                titulo: noticia.titulo
            };
        }

        console.log("Llamando a OpenAI API...");
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 4000,
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            timeout: 60000 //60s
        });

        console.log("Respuesta recibida de OpenAI");
        
        // Verificar que la respuesta tiene el formato esperado
        if (!openaiResponse.data || !openaiResponse.data.choices || !openaiResponse.data.choices[0] || !openaiResponse.data.choices[0].message) {
            console.error("Error: Respuesta de OpenAI con formato inesperado", openaiResponse.data);
            return {
                error: "Error: Formato de respuesta inesperado de OpenAI",
                titulo: noticia.titulo
            };
        }

        const jsonLimpio = simplificarJSON(openaiResponse.data.choices[0].message.content);
        return jsonLimpio;

    } catch (error) {
        console.error("Error al llamar a OpenAI:");
        if (error.response) {
            console.error("Datos de respuesta:", error.response.data);
            console.error("Estado HTTP:", error.response.status);
            console.error("Cabeceras:", error.response.headers);
        } 
        else if (error.request) console.error("No se recibió respuesta:", error.request);
        else  console.error("Error de configuración:", error.message);

        console.error("Configuración completa:", error.config);
        
        return {
            error: "Error al procesar esta noticia con OpenAI: " + (error.response ? error.response.status : error.message),
            titulo: noticia.titulo
        };
    }
};

const solicitarResumen = async (noticias, promptBase) => { // JAVI: No entiendo para que usamos esta función
    let resultados = [];

    for (const noticia of noticias) {
        const resultado = await resumenNoticia(noticia, promptBase);
        resultados.push({
            titulo: noticia.titulo,
            resultado: resultado
        });
    }

    return resultados;
};

// Lógica OpenAI
const verifyApiKey = () => {
    if (!process.env.OPENAI_API_KEY) {
        console.error("Error: API key de OpenAI no configurada");
        return {
            error: "Error de configuración del servidor: API key de OpenAI no disponible",
            solucion: "Verifica que el archivo .env existe y contiene OPENAI_API_KEY=tu_clave_api"
        };
    }
    return null;
};


// Lógica Express - BBDD
const fetchNews = async () => {
    const response = await axios.get('http://localhost:3000/noticias');
    const noticias = response.data;
    
    if (noticias.length === 0) {
        throw new Error("No hay noticias almacenadas en /noticias.");
    }
    return noticias;
};

const getExistingNews = async () => {
    const [noticiasExistentes] = await connection.promise().query(
        'SELECT url, titulo FROM noticias'
    );
    
    const urlsExistentes = new Set();
    const titulosExistentes = new Set();
    
    noticiasExistentes.forEach(n => {
        if (n.url) urlsExistentes.add(n.url.toLowerCase());
        if (n.titulo) titulosExistentes.add(n.titulo.toLowerCase());
    });
    
    return { urlsExistentes, titulosExistentes };
};

const filterDuplicateNews = async (noticias, urlsExistentes, titulosExistentes) => {
    const noticiasFiltradas = [];
    let noticiasDuplicadas = 0;
    
    for (const noticia of noticias) {
        // Check if URL or title already exists in our sets
        if ((noticia.url && urlsExistentes.has(noticia.url.toLowerCase())) || 
            (noticia.titulo && titulosExistentes.has(noticia.titulo.toLowerCase()))) {
            console.log(`Noticia duplicada detectada y omitida: ${noticia.titulo} (URL: ${noticia.url})`);
            noticiasDuplicadas++;
            continue;
        }

        // Double-check with a database query to be absolutely sure
        const [noticiaExistente] = await connection.promise().query(
            'SELECT id FROM noticias WHERE url = ? OR titulo = ?',
            [noticia.url, noticia.titulo]
        );

        if (noticiaExistente.length > 0) {
            console.log(`Noticia duplicada detectada en la base de datos y omitida: ${noticia.titulo}`);
            noticiasDuplicadas++;
            continue;
        }
        
        noticiasFiltradas.push(noticia);
    }
    
    return { noticiasFiltradas, noticiasDuplicadas };
};

const getReferenceData = async () => {
    const [periodicos] = await connection.promise().query('SELECT id, nombre FROM periodicos');
    const [temas] = await connection.promise().query('SELECT id, nombre FROM temas');

    const periodicosPorNombre = {};
    periodicos.forEach(p => {
        periodicosPorNombre[p.nombre.toLowerCase()] = p.id;
    });

    const temasPorNombre = {};
    temas.forEach(t => {
        temasPorNombre[t.nombre.toLowerCase()] = t.id;
    });

    return { periodicosPorNombre, temasPorNombre };
};

const saveNewsToDatabase = async (noticia, resultadoGPT, periodicosPorNombre, temasPorNombre) => {
    // Improved newspaper identification
    let periodicoId = null;
    
    if (noticia.periodico) {
        // Try to find by exact name first
        periodicoId = periodicosPorNombre[noticia.periodico.toLowerCase()];
        
        // If not found, try to find by partial match
        if (!periodicoId) {
            console.log(`Periódico no encontrado exactamente: "${noticia.periodico}". Buscando coincidencia parcial...`);
            
            const periodicoNombre = noticia.periodico.toLowerCase();
            for (const [nombre, id] of Object.entries(periodicosPorNombre)) {
                if (periodicoNombre.includes(nombre) || nombre.includes(periodicoNombre)) {
                    periodicoId = id;
                    console.log(`Coincidencia parcial encontrada: "${nombre}" (ID: ${id})`);
                    break;
                }
            }
        }
        
        // If still not found, extract domain from URL and try to match
        if (!periodicoId && noticia.url) {
            console.log(`Intentando extraer periódico desde URL: ${noticia.url}`);
            try {
                const urlObj = new URL(noticia.url);
                const domain = urlObj.hostname.replace('www.', '');
                
                for (const [nombre, id] of Object.entries(periodicosPorNombre)) {
                    const nombreSimplificado = nombre.toLowerCase().replace(/\s+/g, '');
                    const domainSimplificado = domain.toLowerCase().replace(/\./g, '');
                    
                    if (domainSimplificado.includes(nombreSimplificado) || nombreSimplificado.includes(domainSimplificado)) {
                        periodicoId = id;
                        console.log(`Coincidencia por dominio encontrada: "${nombre}" (ID: ${id}) desde ${domain}`);
                        break;
                    }
                }
            } catch (e) {
                console.error(`Error al procesar URL para extraer periódico: ${e.message}`);
            }
        }
    }
    
    // If still no periódico found, use a default or log a warning
    if (!periodicoId) {
        console.warn(`⚠️ ADVERTENCIA: No se pudo identificar el periódico para la noticia: "${noticia.titulo}"`);
        console.warn(`URL: ${noticia.url}, Periódico proporcionado: ${noticia.periodico}`);
        console.warn(`Periódicos disponibles: ${Object.keys(periodicosPorNombre).join(', ')}`);
        
        // Opcionalmente, asignar un ID de periódico por defecto (por ejemplo, "Desconocido")
        // periodicoId = 1; // ID del periódico "Desconocido" (debes crearlo en la base de datos)
    }

    const temaNombre = resultadoGPT.temas.split(',')[0].trim();
    const temaId = temasPorNombre[temaNombre.toLowerCase()] || null;

    return await Noticia.create({
        titulo: noticia.titulo,
        subtitulo: noticia.subtitulo,
        periodico_id: periodicoId,
        autor: noticia.autor,
        articulo: noticia.articulo,
        url: noticia.url,
        fecha_publicacion: noticia.fecha_publicacion || new Date(),
        fecha_scraping: noticia.fecha_scraping || new Date(),
        temas: temaId,
        palabras_claves: resultadoGPT.palabras_claves,
        coeficiente: resultadoGPT.coeficiente,
        justificacion: resultadoGPT.justificacion
    });
};

/*
###############################
## Comienzo de los Endpoints ##
###############################
*/

app.get('/', (req, res) => {
    res.json(noticias);
});

app.get('/noticias', (req, res) => {
    res.json(noticias);
});

app.post('/noticias', (req, res) => {
    const noticia = req.body;
    
    if (noticiaExiste(noticia)) {
        return res.status(409).json({ 
            error: "Noticia duplicada", 
            mensaje: `La noticia "${noticia.titulo}" ya existe en el sistema.` 
        });
    }
    
    noticias.push(noticia);
    res.status(201).json({ mensaje: 'Noticia creada correctamente' });
});

// JAVI: Hay que analizar si de verdad tanto el '.put' como el '.delete' nos hacen falta
/*app.put('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const noticiaActualizada = req.body;

    if (id >= 0 && id < noticias.length) {
        noticias[id] = noticiaActualizada;
        res.send(`Noticia ${id} actualizada`);
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});

app.delete('/noticias/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (id >= 0 && id < noticias.length) {
        noticias.splice(id, 1);
        res.send(`Noticia ${id} eliminada`);
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});*/


// EndPoint Express + bbdd
app.post('/guardar-noticia', async (req, res) => {
    try {
        const apiKeyError = verifyApiKey();
        if (apiKeyError) return res.status(500).json(apiKeyError);
        
        const noticiasActualizadas = await fetchNews(); // Fetch and validate news
        const { urlsExistentes, titulosExistentes } = await getExistingNews(); // Get existing news
        
        const { noticiasFiltradas, noticiasDuplicadas } = await filterDuplicateNews( // Filter duplicates
            noticiasActualizadas, 
            urlsExistentes, 
            titulosExistentes
        );
        
        // Return early if all news are duplicates
        if (noticiasFiltradas.length == 0) {
            return res.status(200).json({
                mensaje: 'Proceso completado',
                estadisticas: {
                    total: noticiasActualizadas.length,
                    guardadas: 0,
                    duplicadas: noticiasDuplicadas,
                    errores: 0
                }
            });
        }
        
        // Get reference data
        const { periodicosPorNombre, temasPorNombre } = await getReferenceData();
        
        // Process and save news
        let noticiasGuardadas = 0;
        let noticiasConError = 0;

        for (const noticia of noticiasFiltradas) {
            const resultadoGPT = await resumenNoticia(noticia, promptBase);

            if (resultadoGPT.error) {
                console.error(`Error al procesar la noticia: ${noticia.titulo}`);
                noticiasConError++;
                continue;
            }

            try {
                await saveNewsToDatabase(noticia, resultadoGPT, periodicosPorNombre, temasPorNombre);
                
                if (noticia.url) urlsExistentes.add(noticia.url.toLowerCase());
                if (noticia.titulo) titulosExistentes.add(noticia.titulo.toLowerCase());
                
                console.log(`Noticia guardada: ${noticia.titulo}`);
                noticiasGuardadas++;
            } catch (error) {
                console.error('Error al guardar la noticia en la base de datos:', error);
                noticiasConError++;
            }
        }

        res.status(200).json({
            mensaje: 'Proceso completado',
            estadisticas: {
                total: noticiasActualizadas.length,
                guardadas: noticiasGuardadas,
                duplicadas: noticiasDuplicadas,
                errores: noticiasConError
            }
        });

    } catch (error) {
        console.error('Error en guardar-noticia:', error);
        res.status(500).json({ error: "Error al procesar las noticias y guardarlas en la base de datos" });
    }
});

app.get('/noticias/count', (req, res) => { // Endpoint para obtener el conteo de noticias en memoria
    try {
        const count = noticias.length;
        res.json({ count });
    } catch (error) {
        console.error('Error al contar noticias:', error);
        res.status(500).json({ error: 'Error al contar noticias' });
    }
});



/* A futuro separar esto */
app.post('/evaluar-noticia', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL no proporcionada' });
    }

    try {
        console.log(`Evaluando URL: ${url}`);
        
        // Verificar la API key
        const apiKeyError = verifyApiKey();
        if (apiKeyError) return res.status(500).json(apiKeyError);
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "Eres un analista experto en medios de comunicación y evalúas el sesgo ideológico de las noticias en base a su URL." },
                { role: "user", content: `Evalúa el sesgo ideológico del periódico basado en la URL: ${url}. Limítate a darme simplemente un número del -6 al +6 siendo -6 extrema izquierda y 6 extrema derecha.` }
            ],
            max_tokens: 50,
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extraer solo el número de la respuesta
        const content = response.data.choices[0].message.content.trim();
        const scoreMatch = content.match(/-?\d+(\.\d+)?/);
        const score = scoreMatch ? parseFloat(scoreMatch[0]) : null;
        
        console.log(`Puntuación obtenida: ${score}`);
        
        if (score === null) {
            return res.status(500).json({ 
                error: 'No se pudo extraer una puntuación numérica', 
                rawResponse: content 
            });
        }
        
        // Asegurar que el score está en el rango -6 a 6
        const finalScore = Math.max(-6, Math.min(6, score));
        
        res.json({ score: finalScore });

    } catch (error) {
        console.error('Error al evaluar el sesgo ideológico:', error);
        
        // Proporcionar detalles más específicos sobre el error
        let errorMessage = 'Error al obtener la puntuación';
        let errorDetails = {};
        
        if (error.response) {
            // Error de respuesta de la API
            errorMessage = `Error de API (${error.response.status})`;
            errorDetails = error.response.data;
        } else if (error.request) {
            // Error de red
            errorMessage = 'Error de red: No se recibió respuesta';
        } else {
            // Error de configuración
            errorMessage = `Error: ${error.message}`;
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: errorDetails
        });
    }
});



app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

syncModels().then(() => { // Call syncModels to update the database schema. Poner en español esto
  console.log('Database schema updated successfully');
}).catch(err => {
  console.error('Error updating database schema:', err);
});


/*
Bueno, el usuario me ha proporcionado un código bastante extenso de una aplicación Express y me pregunta cómo optimizarlo. Primero, voy a revisar el código para entender qué hace y buscar posibles áreas de mejora.

Veo que el código maneja noticias, utiliza una base de datos MySQL, interactúa con la API de OpenAI, y tiene varios endpoints. Algunas observaciones iniciales:

1. **Estructura del código**: Todo está en un solo archivo, lo que puede ser difícil de mantener. Sería mejor separar en rutas, controladores, servicios, etc.

2. **Conexión a la base de datos**: La conexión a MySQL se crea directamente en el archivo principal. Quizás sería mejor usar un pool de conexiones o un ORM como Sequelize de manera más eficiente.

3. **Manejo de errores**: Algunos bloques try/catch no están manejando adecuadamente los errores, o hay redundancias. También, algunos endpoints podrían no estar devolviendo respuestas consistentes en caso de error.

4. **Configuración**: La configuración de la base de datos y las variables de entorno se manejan en diferentes partes. Centralizar la configuración podría ser útil.

5. **Validaciones**: Falta validación de entradas en algunos endpoints, lo que podría llevar a errores o inyecciones SQL.

6. **Duplicación de código**: Funciones como `noticiaExiste` o `simplificarJSON` podrían estar en módulos separados para reutilizar código.

7. **Optimizaciones de rendimiento**: El procesamiento de noticias es secuencial; quizás se podría procesar en paralelo con Promise.all, teniendo cuidado con los límites de la API de OpenAI.

8. **Documentación**: Falta documentación Swagger o similar para los endpoints, lo que dificulta su uso.

9. **Seguridad**: Algunos endpoints podrían necesitar autenticación/autorización. Además, el uso de CORS está habilitado pero sin opciones específicas.

10. **Manejo de dependencias**: La importación de módulos y el uso de variables de entorno podrían organizarse mejor.
*/