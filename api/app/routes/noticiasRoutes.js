const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.post('/crear-json', noticiasController.crearJSON);
router.post('/guardar-noticia-json', noticiasController.guardarNoticiaJSON);
router.get('/ver-json', noticiasController.verJSON);
router.post('/almacenar-bbdd', noticiasController.almacenarEnBBDD.bind(noticiasController)); // Añadir .bind(noticiasController)
router.get('/ultimas-noticias', noticiasController.getUltimasNoticias.bind(noticiasController));
router.get('/topicos-diarios', noticiasController.getTopicosDiarios.bind(noticiasController));
router.get('/topicos-semanales', noticiasController.getTopicosSemanales.bind(noticiasController));
router.get('/contar-noticias', noticiasController.getContadorNoticias.bind(noticiasController));

module.exports = router;