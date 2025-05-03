const express = require('express');
const router = express.Router();
const AlmacenamientoService = require('../services/almacenamientoService');
const almacenamientoController = require('./almacenamientoController');
const BBDD = require('../database/db');
const QUERIES = require('../core/constants/querys');
const path = require('path');
const { exec } = require('child_process');

class NoticiasController {
    constructor() {
        this.almacenamientoService = new AlmacenamientoService();
    }

    crearJSON(req, res) {
        try {
            const resultado = this.almacenamientoService.crearJSONFile();
            return res.status(resultado.success ? 200 : 400).json(resultado);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al crear archivo JSON",
                error: error.message
            });
        }
    }

    guardarNoticiaJSON(req, res) {
        try {
            if (!AlmacenamientoService.estructuraJSON(req.body)) {
                return res.status(400).json({
                    success: false,
                    message: "Estructura de noticia inválida"
                });
            }
            
            return almacenamientoController.guardarNoticiaJSON(req, res);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al guardar noticia",
                error: error.message
            });
        }
    }

    verJSON(req, res) {
        try {
            const fs = require('fs');
            const path = require('path');
            const dataDir = this.almacenamientoService.dataDir;
            const jsonPath = path.join(dataDir, 'noticias.json');
            
            if (fs.existsSync(jsonPath)) {
                const data = fs.readFileSync(jsonPath, 'utf8');
                const jsonData = JSON.parse(data);
                return res.status(200).json({ 
                    success: true, 
                    data: jsonData 
                });
            }
            return res.status(404).json({ 
                success: false, 
                message: "No se encontró el archivo JSON" 
            });
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return res.status(500).json({
                success: false,
                message: "Error al leer el archivo JSON",
                error: error.message
            });
        }
    }

    async almacenarEnBBDD(req, res) {
        try {
            console.log("Iniciando proceso de almacenamiento de noticias en la base de datos...");
            
            const resultado = await this.almacenamientoService.almacenarNoticiaBBDD();
            
            if (resultado.success) {
                return res.status(200).json({
                    success: true,
                    message: resultado.message,
                    resultado: resultado.resultado
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: resultado.message,
                    error: resultado.error
                });
            }
        } catch (error) {
            console.error("Error al almacenar noticias en la base de datos:", error);
            return res.status(500).json({
                success: false,
                message: "Error al almacenar noticias en la base de datos",
                error: error.message
            });
        }
    }

    async getUltimasNoticias(req, res) {
        try {
            console.log("Obteniendo últimas noticias de cada periódico...");
            
            const sequelize = BBDD.getSequelize();
            const [results] = await sequelize.query(QUERIES.ULTIMAS_NOTICIAS_PERIODICOS);
            
            return res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error("Error al obtener últimas noticias:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener las últimas noticias",
                error: error.message
            });
        }
    }

    async getTopicosDiarios(req, res) {
        try {
            console.log("Obteniendo tópicos diarios...");
            
            const sequelize = BBDD.getSequelize();
            const [results] = await sequelize.query(QUERIES.TOPICOS_DIARIOS);
            
            return res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error("Error al obtener tópicos diarios:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener los tópicos diarios",
                error: error.message
            });
        }
    }

    async getTopicosSemanales(req, res) {
        try {
            console.log("Obteniendo tópicos semanales...");
            
            const sequelize = BBDD.getSequelize();
            const [results] = await sequelize.query(QUERIES.TOPICOS_SEMANALES);
            
            return res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error("Error al obtener tópicos semanales:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener los tópicos semanales",
                error: error.message
            });
        }
    }

    async getContadorNoticias(req, res) {
        try {
            console.log("Obteniendo últimas noticias de cada periódico...");
            
            const sequelize = BBDD.getSequelize();
            const [results] = await sequelize.query(QUERIES.CONTAR_NOTICIAS);
            
            return res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error("Error al obtener últimas noticias:", error);
            return res.status(500).json({
                success: false,
                message: "Error al obtener las últimas noticias",
                error: error.message
            });
        }
    }


    async getAgruparNoticias(req, res) {
        try {
            console.log('Ejecutando script de agrupación de noticias...');
            const scriptPath = path.resolve(__dirname, '../../scripts/grupos/grupos.py');

    
            exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al ejecutar el script:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error al ejecutar el script de agrupación',
                        error: error.message
                    });
                }
    
                console.log('Script ejecutado correctamente:\n', stdout);
                return res.status(200).json({
                    success: true,
                    message: 'Grupos generados e insertados en la base de datos',
                    output: stdout
                });
            });
        } catch (error) {
            console.error("Error general en agrupación:", error);
            return res.status(500).json({
                success: false,
                message: "Fallo inesperado al ejecutar la agrupación",
                error: error.message
            });
        }
    }
}

const controller = new NoticiasController();
module.exports = {
    crearJSON: controller.crearJSON.bind(controller),
    guardarNoticiaJSON: controller.guardarNoticiaJSON.bind(controller),
    verJSON: controller.verJSON.bind(controller),
    almacenarEnBBDD: controller.almacenarEnBBDD.bind(controller),
    getUltimasNoticias: controller.getUltimasNoticias.bind(controller),
    getTopicosDiarios: controller.getTopicosDiarios.bind(controller),
    getTopicosSemanales: controller.getTopicosSemanales.bind(controller),
    // getEvaluarNoticia: controller.getEvaluarNoticia.bind(controller)
    getContadorNoticias: controller.getContadorNoticias.bind(controller), // AÑADI
    getAgruparNoticias: controller.getAgruparNoticias.bind(controller)

};