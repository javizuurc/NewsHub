class Auxiliares {
    static noticiaExisteBBDD(nuevaNoticia, noticias) {
        for(let i = 0; i < noticias.length; i++) {
            if(noticias[i].url == nuevaNoticia.url || noticias[i].titulo == nuevaNoticia.titulo) {
                return true;
            }
        }
        return false;
    }

    static noticiaExiste(nuevaNoticia, fuenteNoticias, camposComparar = ['url', 'titulo']) {

        const noticias = Array.isArray(fuenteNoticias) ? fuenteNoticias : 
                        (fuenteNoticias && typeof fuenteNoticias == 'object') ? 
                        Object.values(fuenteNoticias) : [];
        

        if (noticias.length == 0) return false;
        
        return noticias.some(noticia => {
            return camposComparar.some(campo => {
                return nuevaNoticia[campo] && noticia[campo] && 
                       nuevaNoticia[campo].toString().trim() == noticia[campo].toString().trim();
            });
        });
    }

    static simplificarJSON(respuesta) {
        try {
            let jsonLimpio = respuesta.replace(/```json/g, '').replace(/```/g, '');
            return JSON.parse(jsonLimpio);
        } catch (error) {
            return { error: "Error al parsear la respuesta de OpenAI." };
        }
    }

    static estimarTokens(texto) {
        return Math.ceil(texto.length / 4);
    }

    static verificarApiKey() {
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: API key de OpenAI no configurada");
            return {
                error: "Error de configuración del servidor: API key de OpenAI no disponible",
                solucion: "Verifica que el archivo .env existe y contiene OPENAI_API_KEY=tu_clave_api"
            };
        }
        return null;
    }
    
    static directorioVacio(directorio) {
        const fs = require('fs');
        const path = require('path');
        
        try {
            if (!fs.existsSync(directorio)) return true;
            
            const archivos = fs.readdirSync(directorio);
            
            return archivos.length == 0;
        } catch (error) {
            console.error(`Error al verificar el directorio ${directorio}:`, error);
            return false;
        }
    }
}

module.exports = Auxiliares;