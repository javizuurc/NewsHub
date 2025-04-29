const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');

router.post('/analyze', AIController.analizarNoticias.bind(AIController));
router.get('/test', AIController.testOpenAI.bind(AIController));

module.exports = router;