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

    insertarNoticiasJSON(noticia) {
        try {
            const rutaArchivo = path.join(this.dataDir, 'noticias.json');
            
            if (!fs.existsSync(rutaArchivo)) fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2));
            
            let noticias = [];
            const fileContent = fs.readFileSync(rutaArchivo, 'utf8');
    
            if (fileContent) noticias = JSON.parse(fileContent);
            
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
            const rutaUltimaEliminacion = '/var/www/html/NewsHub/api/data/ultima_eliminacion.txt';
            
            if (fs.existsSync(rutaUltimaEliminacion)) {
                const ultimaEliminacion = fs.readFileSync(rutaUltimaEliminacion, 'utf8');
                const fechaUltimaEliminacion = new Date(ultimaEliminacion);
                const fechaActual = new Date();
                const diferenciaDias = (fechaActual - fechaUltimaEliminacion) / (1000 * 60 * 60 * 24);
                
                if (diferenciaDias < 2) {
                    return {
                        success: false,
                        message: "Aún no han pasado dos días desde la última eliminación"
                    };
                }
            }

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
                fs.writeFileSync(rutaUltimaEliminacion, new Date().toISOString(), 'utf8');
                return {
                    success: true,
                    message: `Se eliminaron ${cantidadNoticias} noticias del archivo JSON`,
                    cantidadEliminada: cantidadNoticias
                };
            } else {
                fs.unlinkSync(rutaArchivo);
                fs.writeFileSync(rutaUltimaEliminacion, new Date().toISOString(), 'utf8');
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
                    
                    const tienePalabrasClave = noticiaJSON.palabras_claves &&
                    typeof noticiaJSON.palabras_claves == 'object' &&
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
    
                    const camposObligatorios = ['titulo', 'articulo', 'periodico', 'coeficiente', 'posicion', 'justificacion'];
                    const camposFaltantes = camposObligatorios.filter(campo => 
                        !noticiaJSON[campo] || 
                        noticiaJSON[campo] == '' || 
                        (Array.isArray(noticiaJSON[campo]) && noticiaJSON[campo].length == 0)
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
                        temasArray = Array.isArray(noticiaJSON.temas) ? 
                            noticiaJSON.temas.map(tema => tema.trim()) : 
                            noticiaJSON.temas.split(',').map(tema => tema.trim());
                        
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
    
                    if (noticiaJSON.id_claves && Array.isArray(noticiaJSON.id_claves) && noticiaJSON.id_claves.length > 0) {
                        console.log(`Procesando ${noticiaJSON.id_claves.length} palabras clave para la noticia ID: ${nuevaNoticia.id}`);
                        
                        for (const claveId of noticiaJSON.id_claves) {
                            await NoticiasClaves.create({
                                noticia_id: nuevaNoticia.id,
                                clave_id: claveId
                            });
                        }
                        
                        console.log(`Relaciones de palabras clave creadas para la noticia ID: ${nuevaNoticia.id}`);
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

    async almacenarGruposBBDD() {
        try {
            const rutaArchivo = path.join(this.dataDir, 'grupos.json');
            if (!fs.existsSync(rutaArchivo)) {
                return { success: false, message: "Archivo grupos.json no encontrado" };
            }
    
            const contenido         = fs.readFileSync(rutaArchivo, 'utf8');
            const grupos            = JSON.parse(contenido);
            const sequelize         = this.BBDD.getSequelize();
            const GrupoModel        = sequelize.models.Grupo;
            const GrupoNoticiaModel = sequelize.models.grupo_noticia;
    
            const resultado = {
                total: grupos.length,
                insertados: 0,
                errores: 0,
                detalles: []
            };
    
            for (const grupo of grupos) {
                try {
                    const [grupoCreado, creado] = await GrupoModel.findOrCreate({
                        where: { titular_general: grupo.titular_general },
                        defaults: {
                            titular_general: grupo.titular_general,
                            fecha_creacion: new Date()
                        }
                    });
    
                    for (const noticia of grupo.noticias) {
                        await GrupoNoticiaModel.findOrCreate({
                            where: {
                                grupo_id: grupoCreado.id,
                                noticia_id: noticia.id
                            },
                            defaults: {
                                grupo_id: grupoCreado.id,
                                noticia_id: noticia.id,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        });
                    }
    
                    resultado.insertados++;
                    resultado.detalles.push({
                        titular_general: grupo.titular_general,
                        grupo_id: grupoCreado.id,
                        estado: creado ? "nuevo" : "existente"
                    });
                } catch (err) {
                    console.error("Error al insertar grupo:", grupo.titular_general, err);
                    resultado.errores++;
                    resultado.detalles.push({
                        titular_general: grupo.titular_general,
                        estado: "error",
                        error: err.message
                    });
                }
            }
    
            return {
                success: true,
                message: `Grupos procesados: ${resultado.total}, Insertados: ${resultado.insertados}, Errores: ${resultado.errores}`,
                resultado
            };
    
        } catch (error) {
            console.error("Error general al almacenar grupos:", error);
            return {
                success: false,
                message: "Error general al almacenar grupos",
                error: error.message
            };
        }
    }

    async obtenerPalabrasClaveUnicas() {
        const palabrasClaveJSON = this.sacarPalabrasClaves();
        return Object.values(palabrasClaveJSON)
            .flat()
            .filter((palabra, index, self) => palabra && self.indexOf(palabra) == index);
    }

    async verificarPalabraEnBBDD(palabra, ClaveModel) {
        const resultadoExistencia = await this.BBDD.existenRegistros(
            ClaveModel, 
            { nombre: palabra },
            { exactMatch: true, obtenerRegistros: true }
        );
        
        if (resultadoExistencia.existe) {
            const registro = resultadoExistencia.registros[0];
            return { existe: true, id: registro.id };
        }
        return { existe: false };
    }

    async insertarPalabraClave(palabra, ClaveModel) {
        try {
            const nuevaClave = await ClaveModel.create({ nombre: palabra });
            return { success: true, id: nuevaClave.id };
        } catch (error) {
            console.error(`Error al insertar palabra clave "${palabra}":`, error);
            return { success: false, error };
        }
    }

    async actualizarNoticiasConIdsPalabrasClaves(mapaPalabrasIds) {
        try {
            const resultado = this.leerNoticiasJSON(true);
            
            if (resultado.success && resultado.data) {
                const noticias = resultado.data;
                let modificado = false;
                
                noticias.forEach((noticia) => {
                    if (noticia.palabras_claves) {
                        const idsArray = [];
                        
                        if (noticia.palabras_claves.comunes) {
                            noticia.palabras_claves.comunes.forEach(palabra => {
                                if (mapaPalabrasIds[palabra]) idsArray.push(mapaPalabrasIds[palabra]);
                            });
                        }
                        
                        if (noticia.palabras_claves.nombres_propios) {
                            noticia.palabras_claves.nombres_propios.forEach(palabra => {
                                if (mapaPalabrasIds[palabra]) idsArray.push(mapaPalabrasIds[palabra]);
                            });
                        }
                        
                        noticia.id_claves = idsArray;
                        modificado = true;
                    }
                });
                
                if (modificado) {
                    const filePath = path.join(this.dataDir, 'noticias.json');
                    fs.writeFileSync(filePath, JSON.stringify(noticias, null, 2), 'utf8');
                    return { success: true };
                }
            }
            return { success: false };
        } catch (error) {
            console.error("Error al actualizar noticias.json:", error);
            return { success: false, error };
        }
    }
}

module.exports = AlmacenamientoService;