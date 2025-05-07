const express = require('express');
const AlmacenamientoService = require('../services/almacenamientoService');

class AlmacenamientoController {
    constructor() {
        this.almacenamientoService = new AlmacenamientoService();
    }
    
    getDataDirectory(req, res) {
    }

    createDataDirectory(req, res) {
    }

    getJsonData(req, res) {
    }

    guardarNoticiaJSON(req, res) {
    }

    leerJSON(req, res) {
    }
    
    crearJSON(req, res) {
    }
    
    obtenerPalabrasClave(req, res) {
    }

    async verificarPalabrasClave(req, res) {
        try {
            console.log("Iniciando verificación de palabras clave...");
            const palabrasClaveJSON = this.almacenamientoService.sacarPalabrasClaves();
            console.log("Palabras clave obtenidas del JSON:", JSON.stringify(palabrasClaveJSON, null, 2));
            
            // Mapeo palabra original -> palabra normalizada
            const palabraOriginalPorNormalizada = {};
            const todasPalabrasJSON = Object.values(palabrasClaveJSON)
                .flat()
                .filter((palabra, index, self) => {
                    if (!palabra) return false;
                    const normalizada = palabra.trim().toLowerCase();
                    palabraOriginalPorNormalizada[normalizada] = palabra;
                    return self.findIndex(p => p && p.trim().toLowerCase() === normalizada) === index;
                });
            
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
                const normalizada = palabra.trim().toLowerCase();
                console.log(`Verificando palabra: "${palabra}"`);
                const resultadoExistencia = await this.almacenamientoService.BBDD.existenRegistros(
                    ClaveModel,
                    { nombre: normalizada },
                    { exactMatch: true, obtenerRegistros: true }
                );
            
                if (resultadoExistencia.existe) {
                    const registro = resultadoExistencia.registros[0];
                    console.log(`Palabra "${palabra}" encontrada con ID: ${registro.id}`);
                    palabrasExistentes.push({
                        palabra: palabraOriginalPorNormalizada[normalizada],
                        id: registro.id
                    });
                    mapaPalabrasIds[normalizada] = registro.id;
                } else {
                    try {
                        console.log(`Insertando nueva palabra: "${palabra}"`);
                        const nuevaClave = await ClaveModel.create({
                            nombre: normalizada
                        });
            
                        console.log(`Palabra "${palabra}" insertada con ID: ${nuevaClave.id}`);
                        palabrasNuevas.push({
                            palabra: palabraOriginalPorNormalizada[normalizada],
                            id: nuevaClave.id
                        });
                        mapaPalabrasIds[normalizada] = nuevaClave.id;
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
                                    const normalizada = palabra.trim().toLowerCase();
                                    if (mapaPalabrasIds[normalizada]) idsArray.push(mapaPalabrasIds[normalizada]);
                                });
                            }
            
                            if (noticia.palabras_claves.nombres_propios) {
                                noticia.palabras_claves.nombres_propios.forEach(palabra => {
                                    const normalizada = palabra.trim().toLowerCase();
                                    if (mapaPalabrasIds[normalizada]) idsArray.push(mapaPalabrasIds[normalizada]);
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