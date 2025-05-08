const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticiasController');

router.post('/crear-json', noticiasController.crearJSON.bind(noticiasController));
router.post('/guardar-noticia-json', noticiasController.guardarNoticiaJSON.bind(noticiasController));
router.get('/ver-json', noticiasController.verJSON.bind(noticiasController));
router.post('/almacenar-bbdd', noticiasController.almacenarEnBBDD.bind(noticiasController)); 
router.get('/ultimas-noticias', noticiasController.getUltimasNoticias.bind(noticiasController));
router.get('/topicos-diarios', noticiasController.getTopicosDiarios.bind(noticiasController));
router.get('/topicos-semanales', noticiasController.getTopicosSemanales.bind(noticiasController));
router.get('/contar-noticias', noticiasController.getContadorNoticias.bind(noticiasController));
router.get('/contar-periodicos', noticiasController.getContarPeriodicos.bind(noticiasController));
router.get('/media-calificaciones', noticiasController.getMediaCalificaciones.bind(noticiasController));
router.get('/dias-noticias', noticiasController.getDiasConNoticias.bind(noticiasController));
router.post('/agrupar-bbdd', noticiasController.insertarGruposBBDD.bind(noticiasController));
router.get('/grupos-noticias', noticiasController.getGruposNoticias.bind(noticiasController)); 


module.exports = router;