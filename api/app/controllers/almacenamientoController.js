const express = require('express');
const AlmacenamientoService = require('../services/almacenamientoService');

class AlmacenamientoController {
    constructor() {
        this.almacenamientoService = new AlmacenamientoService();
    }
    
    getDataDirectory(req, res) {
        try {
            const dataDir = this.almacenamientoService.dataDir;
            return res.status(200).json({
                success: true,
                directory: dataDir
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener directorio de datos",
                error: error.message
            });
        }
    }

    createDataDirectory(req, res) {
        try {
            const result = this.almacenamientoService.crearDirectorio();
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al crear directorio de datos",
                error: error.message
            });
        }
    }

    getJsonData(req, res) {
        try {
            const result = this.almacenamientoService.leerNoticiasJSON();
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al leer datos JSON",
                error: error.message
            });
        }
    }

    createBackup(req, res) {
        try {
            const result = this.almacenamientoService.crearBackup();
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al crear backup",
                error: error.message
            });
        }
    }

    guardarNoticiaJSON(req, res) {
        try {
            console.log('=== Datos recibidos en guardarNoticiaJSON ===');
            console.log('Body:', JSON.stringify(req.body, null, 2));
            console.log('=======================================');
            
            const result = this.almacenamientoService.insertarNoticiasJSON(req.body);
            return res.status(result.success ? 201 : 400).json(result);
        } catch (error) {
            console.error('Error en guardarNoticiaJSON:', error);  // Añadido log del error
            return res.status(500).json({
                success: false,
                message: "Error al guardar noticia en JSON",
                error: error.message
            });
        }
    }

    leerJSON(req, res) {
        try {
            const crearSiNoExiste = req.query.crear == 'true';
            const result = this.almacenamientoService.leerNoticiasJSON(crearSiNoExiste);
            
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error) {
            console.error("Error al leer JSON:", error);
            return res.status(500).json({
                success: false,
                message: "Error al leer JSON",
                error: error.message
            });
        }
    }
    
    crearJSON(req, res) {
        try {
            const result = this.almacenamientoService.eliminarContenidoJSON(true);
            
            return res.status(200).json({
                success: result.success,
                message: result.message
            });
        } catch (error) {
            console.error("Error al crear JSON:", error);
            return res.status(500).json({
                success: false,
                message: "Error al crear JSON",
                error: error.message
            });
        }
    }
    
    obtenerPalabrasClave(req, res) {
        try {
            const palabrasClave = this.almacenamientoService.sacarPalabrasClaves();
            
            return res.status(200).json({
                success: true,
                message: "Palabras clave extraídas correctamente",
                data: palabrasClave
            });
        } catch (error) {
            console.error("Error al extraer palabras clave:", error);
            return res.status(500).json({
                success: false,
                message: "Error al extraer palabras clave",
                error: error.message
            });
        }
    }

    async verificarPalabrasClave(req, res) {
        try {
            console.log("Iniciando verificación de palabras clave...");
            const palabrasClaveJSON = this.almacenamientoService.sacarPalabrasClaves();
            console.log("Palabras clave obtenidas del JSON:", JSON.stringify(palabrasClaveJSON, null, 2));
            
            const todasPalabrasJSON = Object.values(palabrasClaveJSON)
                .flat()
                .filter((palabra, index, self) => palabra && self.indexOf(palabra) == index);
            console.log(`Total de palabras únicas encontradas: ${todasPalabrasJSON.length}`);
            
            if (todasPalabrasJSON.length == 0) {
                console.log("No se encontraron palabras clave para verificar");
                return res.status(200).json({
                    success: true,
                    message: "No hay palabras clave en el JSON para verificar",
                    palabras: {
                        existentes: [],
                        nuevas: []
                    }
                });
            }
            
            const sequelize = this.almacenamientoService.BBDD.getSequelize();
            const ClaveModel = sequelize.models.Clave;
            
            if (!ClaveModel) {
                console.error("Modelo Clave no encontrado en la base de datos");
                return res.status(404).json({
                    success: false,
                    message: "El modelo de Clave no está registrado en la base de datos"
                });
            }
            
            console.log("Verificando palabras en la base de datos...");
            const palabrasExistentes = [];
            const palabrasNuevas = [];
            const mapaPalabrasIds = {};
            
            for (const palabra of todasPalabrasJSON) {
                console.log(`Verificando palabra: "${palabra}"`);
                const resultadoExistencia = await this.almacenamientoService.BBDD.existenRegistros(
                    ClaveModel, 
                    { nombre: palabra },
                    { exactMatch: true, obtenerRegistros: true }
                );
                
                if (resultadoExistencia.existe) {
                    const registro = resultadoExistencia.registros[0];
                    console.log(`Palabra "${palabra}" encontrada con ID: ${registro.id}`);
                    palabrasExistentes.push({
                        palabra: palabra,
                        id: registro.id
                    });
                    mapaPalabrasIds[palabra] = registro.id;
                } else {
                    try {
                        console.log(`Insertando nueva palabra: "${palabra}"`);
                        const nuevaClave = await ClaveModel.create({
                            nombre: palabra
                        });
                        
                        console.log(`Palabra "${palabra}" insertada con ID: ${nuevaClave.id}`);
                        palabrasNuevas.push({
                            palabra: palabra,
                            id: nuevaClave.id
                        });
                        mapaPalabrasIds[palabra] = nuevaClave.id;
                    } catch (error) {
                        console.error(`Error al insertar palabra clave "${palabra}":`, error);
                    }
                }
            }
            
            try {
                console.log("Actualizando archivo noticias.json con IDs de palabras clave...");
                
                const resultado = this.almacenamientoService.leerNoticiasJSON(true);
                
                if (resultado.success && resultado.data) {
                    const noticias = resultado.data;
                    let modificado = false;
                    
                    noticias.forEach((noticia, index) => {
                        console.log(`Procesando noticia ${index + 1}...`);
                        
                        if (noticia.palabras_claves) {
                            const idsArray = [];
                            
                            if (noticia.palabras_claves.comunes) {
                                noticia.palabras_claves.comunes.forEach(palabra => {
                                    if (mapaPalabrasIds[palabra]) {
                                        idsArray.push(mapaPalabrasIds[palabra]);
                                    }
                                });
                            }
                            
                            if (noticia.palabras_claves.nombres_propios) {
                                noticia.palabras_claves.nombres_propios.forEach(palabra => {
                                    if (mapaPalabrasIds[palabra]) {
                                        idsArray.push(mapaPalabrasIds[palabra]);
                                    }
                                });
                            }
                            
                            noticia.id_claves = idsArray;
                            console.log(`Noticia ${index + 1} actualizada con id_claves:`, idsArray);
                            modificado = true;
                        }
                    });
                    
                    if (modificado) {
                        const fs = require('fs');
                        const path = require('path');
                        const dataDir = this.almacenamientoService.dataDir;
                        const filePath = path.join(dataDir, 'noticias.json');
                        
                        fs.writeFileSync(filePath, JSON.stringify(noticias, null, 2), 'utf8');
                        console.log("Archivo noticias.json actualizado correctamente");
                    }
                } else {
                    console.error("No se pudo leer el archivo noticias.json para actualizar");
                }
            } catch (errorActualizacion) {
                console.error("Error al actualizar noticias.json:", errorActualizacion);
            }
            
            return res.status(200).json({
                success: true,
                message: "Verificación e inserción de palabras clave completada. Archivo noticias.json actualizado.",
                palabras: {
                    existentes: palabrasExistentes.length,
                    nuevas: palabrasNuevas.length
                }
            });
        } catch (error) {
            console.error("Error al verificar palabras clave:", error);
            return res.status(500).json({
                success: false,
                message: "Error al verificar palabras clave",
                error: error.message
            });
        }
    }
}

module.exports = new AlmacenamientoController();