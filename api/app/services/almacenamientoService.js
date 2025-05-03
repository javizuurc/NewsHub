const path = require('path');
const fs = require('fs');
const Auxiliares = require('../core/utils/auxiliares.js');
const config = require('../config/storage.config.js');
const BBDD = require('../database/db.js');

class AlmacenamientoService {
    constructor() {
        this.auxiliares = Auxiliares;
        this.BBDD = BBDD;
        this.dataDir = config.dataDirectory || path.join(__dirname, '../../data');
        
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    static estructuraJSON(body) {
        const camposRequeridos = [
            'titulo',
            'subtitulo', 
            'periodico',
            'autor',
            'articulo',
            'url',
            'fecha_publicacion',
            'fecha_scraping',
            'imagen',
            'temas',
            'palabras_claves', 
            'coeficiente',
            'posicion',
            'justificacion'
        ];
        
        const todosLosCamposExisten = camposRequeridos.every(campo => campo in body);
        
        const estructuraPalabrasClavesCorrecta = body.palabras_claves && 
            typeof body.palabras_claves == 'object' &&
            Array.isArray(body.palabras_claves.comunes) &&
            Array.isArray(body.palabras_claves.nombres_propios);

        const estructuraJustificacionCorrecta = Array.isArray(body.justificacion);
        
        const camposCriticos = ['titulo', 'articulo', 'coeficiente'];
        const camposCriticosCompletos = camposCriticos.every(campo => 
            campo in body && 
            body[campo] != null && 
            body[campo] != undefined && 
            body[campo] != ''
        );
        
        return todosLosCamposExisten && 
               camposCriticosCompletos && 
               estructuraPalabrasClavesCorrecta && 
               estructuraJustificacionCorrecta;
    }
    
    crearJSONFile() {
        const rutaArchivo = path.join(this.dataDir, 'noticias.json');
        var estado = {};
        if (this.auxiliares.directorioVacio(this.dataDir)) {
            fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2));
            estado = { success: true, message: "Archivo JSON creado correctamente" };
        } else {
            if (!fs.existsSync(rutaArchivo)) {
                fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2));
                estado = { success: true, message: "Archivo JSON creado correctamente" };
            }
            estado = { success: false, message: "El directorio no está vacío y el archivo ya existe" };
        }

        return estado;
    }

    insertarNoticiasJSON(noticia) {
        try {
            const rutaArchivo = path.join(this.dataDir, 'noticias.json');
            
            if (!fs.existsSync(rutaArchivo)) fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2));
            
            let noticias = [];
            const fileContent = fs.readFileSync(rutaArchivo, 'utf8');
    
            if (fileContent) {
                noticias = JSON.parse(fileContent);
            }
            
            const noticiaExistenteIndex = noticias.findIndex(n => 
                (n.url && noticia.url && n.url == noticia.url) || 
                (n.titulo && noticia.titulo && n.titulo == noticia.titulo)
            );
            
            if (noticiaExistenteIndex != -1) {
                const noticiaExistente = noticias[noticiaExistenteIndex];
                let camposActualizados = false;
                let camposActualizadosNombres = [];
                
                Object.keys(noticia).forEach(campo => {
                    noticiaExistente[campo] = noticia[campo];
                    camposActualizados = true;
                    camposActualizadosNombres.push(campo);
                });
                
                noticias[noticiaExistenteIndex] = noticiaExistente;
                fs.writeFileSync(rutaArchivo, JSON.stringify(noticias, null, 2), 'utf8');
                
                return {
                    success: true,
                    message: `Noticia "${noticia.titulo}" actualizada con nuevos datos`,
                    updated: true,
                    camposActualizados: camposActualizadosNombres
                };
            }
            
            noticias.push(noticia);
            fs.writeFileSync(rutaArchivo, JSON.stringify(noticias, null, 2), 'utf8');
            
            return {
                success: true,
                message: `Noticia "${noticia.titulo}" guardada correctamente en JSON`,
                updated: false,
                new: true
            };
        } catch (error) {
            console.error("Error al guardar noticia en JSON:", error);
            return {
                success: false,
                message: "Error al guardar noticia en JSON",
                error: error.message
            };
        }
    }
    
    
    leerNoticiasJSON(crearSiNoExiste = false) {
        try {
            const rutaArchivo = path.join(this.dataDir, 'noticias.json');
            
            if (!fs.existsSync(rutaArchivo)) {
                if (crearSiNoExiste) {
                    fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2));
                    return {
                        success: true,
                        message: "Archivo JSON creado correctamente",
                        data: []
                    };
                } else {
                    return {
                        success: false,
                        message: "El archivo JSON de noticias no existe",
                        data: []
                    };
                }
            }
            
            const fileContent = fs.readFileSync(rutaArchivo, 'utf8');
            const noticias = fileContent ? JSON.parse(fileContent) : [];
            
            return {
                success: true,
                message: `Se leyeron ${noticias.length} noticias del archivo JSON`,
                data: noticias
            };
        } catch (error) {
            console.error("Error al leer noticias del JSON:", error);
            return {
                success: false,
                message: "Error al leer noticias del JSON",
                error: error.message,
                data: []
            };
        }
    }
    
    eliminarContenidoJSON(crearArchivoVacio = true) {
        try {
            const rutaArchivo = path.join(this.dataDir, 'noticias.json');
            
            if (!fs.existsSync(rutaArchivo)) {
                return {
                    success: false,
                    message: "El archivo JSON de noticias no existe"
                };
            }
            
            const fileContent = fs.readFileSync(rutaArchivo, 'utf8');
            const noticias = fileContent ? JSON.parse(fileContent) : [];
            const cantidadNoticias = noticias.length;
            
            if (crearArchivoVacio) {
                fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2), 'utf8');
                return {
                    success: true,
                    message: `Se eliminaron ${cantidadNoticias} noticias del archivo JSON`,
                    cantidadEliminada: cantidadNoticias
                };
            } else {
                fs.unlinkSync(rutaArchivo);
                return {
                    success: true,
                    message: `Se eliminó el archivo JSON con ${cantidadNoticias} noticias`,
                    cantidadEliminada: cantidadNoticias,
                    archivoEliminado: true
                };
            }
        } catch (error) {
            console.error("Error al eliminar contenido del JSON:", error);
            return {
                success: false,
                message: "Error al eliminar contenido del JSON",
                error: error.message
            };
        }
    }

    async almacenarNoticiaBBDD() {
        try {
            const resultadoJSON = this.leerNoticiasJSON(true);
            if (!resultadoJSON.success) {
                return {
                    success: false,
                    message: "Error al leer el archivo JSON de noticias",
                    error: resultadoJSON.message
                };
            }
            
            const noticias = resultadoJSON.data;
            const sequelize = this.BBDD.getSequelize();
            const NoticiaModel = sequelize.models.Noticia;
            const PeriodicoModel = sequelize.models.Periodico;
            const TemaModel = sequelize.models.Tema;
            const NoticiasClaves = sequelize.models.noticias_claves;
            
            const resultado = {
                total: noticias.length,
                insertadas: 0,
                errores: 0,
                omitidas: 0,
                detalles: []
            };
    
            for (const noticiaJSON of noticias) {
                try {
                    console.log(`Procesando noticia: ${noticiaJSON.titulo}`);
                    
                    // Verificar si la noticia ya existe en la base de datos
                    const noticiaExistente = await NoticiaModel.findOne({
                        where: { url: noticiaJSON.url }
                    });
    
                    if (noticiaExistente) {
                        console.log(`La noticia ya existe en la base de datos: ${noticiaJSON.titulo}`);
                        resultado.omitidas++;
                        resultado.detalles.push({
                            titulo: noticiaJSON.titulo,
                            estado: "omitida",
                            razon: "Ya existe en la base de datos",
                            id: noticiaExistente.id
                        });
                        continue;
                    }
                    
                    // Validar que la noticia tenga palabras clave no vacías
                    const tienePalabrasClave = noticiaJSON.palabras_claves &&
                    typeof noticiaJSON.palabras_claves === 'object' &&
                    (
                        (Array.isArray(noticiaJSON.palabras_claves.comunes) && noticiaJSON.palabras_claves.comunes.length > 0) ||
                        (Array.isArray(noticiaJSON.palabras_claves.nombres_propios) && noticiaJSON.palabras_claves.nombres_propios.length > 0)
                    );

                    
                    if (!tienePalabrasClave) {
                        console.log(`Omitiendo noticia sin palabras clave válidas: ${noticiaJSON.titulo}`);
                        resultado.omitidas++;
                        resultado.detalles.push({
                            titulo: noticiaJSON.titulo,
                            estado: "omitida",
                            razon: "Sin palabras clave válidas"
                        });
                        continue;
                    }
    
                    // Validar campos obligatorios
                    const camposObligatorios = ['titulo', 'articulo', 'periodico', 'coeficiente', 'posicion', 'justificacion'];
                    const camposFaltantes = camposObligatorios.filter(campo => 
                        !noticiaJSON[campo] || 
                        noticiaJSON[campo] === '' || 
                        (Array.isArray(noticiaJSON[campo]) && noticiaJSON[campo].length === 0)
                    );
                    
                    if (camposFaltantes.length > 0) {
                        console.log(`Omitiendo noticia con campos obligatorios faltantes: ${noticiaJSON.titulo}`);
                        resultado.omitidas++;
                        resultado.detalles.push({
                            titulo: noticiaJSON.titulo,
                            estado: "omitida",
                            razon: `Campos faltantes: ${camposFaltantes.join(', ')}`
                        });
                        continue;
                    }
    
                    // Continuar con la inserción si pasa todas las validaciones
                    let periodicoId = null;
                    if (noticiaJSON.periodico) {
                        const [periodico] = await PeriodicoModel.findOrCreate({
                            where: { nombre: noticiaJSON.periodico },
                            defaults: { nombre: noticiaJSON.periodico }
                        });
                        periodicoId = periodico.id;
                    }
    
                    const datosNoticia = {
                        titulo: noticiaJSON.titulo,
                        subtitulo: noticiaJSON.subtitulo || null,
                        autor: noticiaJSON.autor || null,
                        articulo: noticiaJSON.articulo || null,
                        url: noticiaJSON.url || null,
                        fecha_publicacion: noticiaJSON.fecha_publicacion ? new Date(noticiaJSON.fecha_publicacion) : null,
                        fecha_scraping: noticiaJSON.fecha_scraping ? new Date(noticiaJSON.fecha_scraping) : null,
                        imagen: noticiaJSON.imagen || null,
                        coeficiente: noticiaJSON.coeficiente ? noticiaJSON.coeficiente.toString() : null,
                        justificacion: noticiaJSON.justificacion ? JSON.stringify(noticiaJSON.justificacion) : null,
                        periodico_id: periodicoId
                    };
                    console.log(noticiaJSON.imagen)
                    const nuevaNoticia = await NoticiaModel.create(datosNoticia);
                    console.log(`Noticia insertada con ID: ${nuevaNoticia.id}`);
    
                    if (noticiaJSON.temas) {
                        let temasArray = [];

                        if (Array.isArray(noticiaJSON.temas)) {
                            temasArray = noticiaJSON.temas.map(tema => tema.trim());
                        } else if (typeof noticiaJSON.temas === 'string') {
                            temasArray = noticiaJSON.temas.split(',').map(tema => tema.trim());
                        }
                        
                        for (const temaNombre of temasArray) {
                            if (temaNombre) {
                                const [tema] = await TemaModel.findOrCreate({
                                    where: { nombre: temaNombre },
                                    defaults: { nombre: temaNombre }
                                });
                                await nuevaNoticia.addTema(tema);
                            }
                        }
                    }
    
                    // Procesar palabras clave
                    if (noticiaJSON.id_claves && Array.isArray(noticiaJSON.id_claves) && noticiaJSON.id_claves.length > 0) {
                        console.log(`Procesando ${noticiaJSON.id_claves.length} palabras clave para la noticia ID: ${nuevaNoticia.id}`);
                        
                        for (const claveId of noticiaJSON.id_claves) {
                            await NoticiasClaves.create({
                                noticia_id: nuevaNoticia.id,
                                clave_id: claveId
                            });
                        }
                        
                        console.log(`Relaciones de palabras clave creadas para la noticia ID: ${nuevaNoticia.id}`);
                    } else {
                        console.log(`La noticia no tiene id_claves válidos: ${nuevaNoticia.id}`);
                        // Podríamos considerar eliminar la noticia si no tiene id_claves
                        // await nuevaNoticia.destroy();
                        // resultado.insertadas--;
                        // resultado.omitidas++;
                        // continue;
                    }
    
                    resultado.insertadas++;
                    resultado.detalles.push({
                        titulo: noticiaJSON.titulo,
                        estado: "insertada",
                        id: nuevaNoticia.id
                    });
                } catch (errorNoticia) {
                    console.error(`Error al procesar noticia: ${noticiaJSON.titulo}`, errorNoticia);
                    resultado.errores++;
                    resultado.detalles.push({
                        titulo: noticiaJSON.titulo,
                        estado: "error",
                        error: errorNoticia.message
                    });
                }
            }
    
            return {
                success: true,
                message: `Proceso completado. Total: ${resultado.total}, Insertadas: ${resultado.insertadas}, Omitidas: ${resultado.omitidas}, Errores: ${resultado.errores}`,
                resultado: resultado
            };
        } catch (error) {
            console.error("Error al almacenar noticias en la base de datos:", error);
            return {
                success: false,
                message: "Error al almacenar noticias en la base de datos",
                error: error.message
            };
        }
    }

    sacarPalabrasClaves(){
        const resultado = this.leerNoticiasJSON();
        if (resultado.success && resultado.data.length > 0) {
            const palabrasClavesPorIndice = {};
            
            resultado.data.forEach((noticia, indice) => {
                if (noticia.palabras_claves) {
                    const todasPalabras = [
                        ...(noticia.palabras_claves.comunes || []).map(palabra => palabra.toLowerCase()),
                        ...(noticia.palabras_claves.nombres_propios || []).map(palabra => palabra.toLowerCase())
                    ];
                    palabrasClavesPorIndice[indice] = todasPalabras;
                } else {
                    palabrasClavesPorIndice[indice] = [];
                }
            });
            
            console.log("Palabras clave extraídas por índice:", palabrasClavesPorIndice);
            return palabrasClavesPorIndice;
        } else {
            console.log("No hay noticias disponibles para extraer palabras clave");
            return {};
        }
    }
}

module.exports = AlmacenamientoService;