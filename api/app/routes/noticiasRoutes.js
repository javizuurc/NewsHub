const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.post('/crear-json', noticiasController.crearJSON);
router.post('/guardar-noticia-json', noticiasController.guardarNoticiaJSON);
router.get('/ver-json', noticiasController.verJSON);
router.post('/almacenar-bbdd', noticiasController.almacenarEnBBDD);
router.get('/ultimas-noticias', noticiasController.getUltimasNoticias);
router.get('/topicos-diarios', noticiasController.getTopicosDiarios);
router.get('/topicos-semanales', noticiasController.getTopicosSemanales);


module.exports = router;