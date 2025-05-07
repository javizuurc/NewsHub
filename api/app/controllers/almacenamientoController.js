const express = require('express');
const fs = require('fs');
const path = require('path');
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

    guardarNoticiaJSON(req, res) {
        try {
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

    // En caso de fallo, esta puede ser una razón
    async verificarPalabrasClave(req, res) {
        try {
            console.log("Iniciando verificación de palabras clave...");
            
            const todasPalabrasJSON = await this.almacenamientoService.obtenerPalabrasClaveUnicas();
            
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
                
                const resultadoVerificacion = await this.almacenamientoService.verificarPalabraEnBBDD(palabra, ClaveModel);
                
                if (resultadoVerificacion.existe) {
                    palabrasExistentes.push({ palabra, id: resultadoVerificacion.id });
                    mapaPalabrasIds[palabra] = resultadoVerificacion.id;
                } else {
                    const resultadoInsercion = await this.almacenamientoService.insertarPalabraClave(palabra, ClaveModel);
                    if (resultadoInsercion.success) {
                        palabrasNuevas.push({ palabra, id: resultadoInsercion.id });
                        mapaPalabrasIds[palabra] = resultadoInsercion.id;
                    }
                }
            }
            
            console.log("Actualizando archivo noticias.json con IDs de palabras clave...");
            await this.almacenamientoService.actualizarNoticiasConIdsPalabrasClaves(mapaPalabrasIds);
            
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