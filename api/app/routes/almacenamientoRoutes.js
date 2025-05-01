const express = require('express');
const router = express.Router();
const almacenamientoController = require('../controllers/almacenamientoController');

router.post('/crear-json', almacenamientoController.crearJSON.bind(almacenamientoController));
router.get('/leer-json', almacenamientoController.leerJSON.bind(almacenamientoController));
router.get('/data-directory', almacenamientoController.getDataDirectory.bind(almacenamientoController));
router.post('/create-directory', almacenamientoController.createDataDirectory.bind(almacenamientoController));
router.get('/json', almacenamientoController.getJsonData.bind(almacenamientoController));
router.post('/verificar-palabras-clave', almacenamientoController.verificarPalabrasClave.bind(almacenamientoController));

module.exports = router;