const express = require('express');
const aiRoutes = require('./aiRoutes');
const noticiasRoutes = require('./noticiasRoutes');
const almacenamientoRoutes = require('./almacenamientoRoutes');

const router = express.Router();


router.use('/noticias', noticiasRoutes);
router.use('/ai', aiRoutes);
router.use('/storage', almacenamientoRoutes);
router.get('/health', (req, res) => { res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });});

module.exports = router;