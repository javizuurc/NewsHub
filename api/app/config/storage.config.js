// Cambiar el nombre del fichero a path.js (o equivalente al español)
// Hacer clase con todos los path requerido (cada vez que vea uno lo dejas aquí):

/*
    TODAS LAS IMPORTACIONES A DISTINTOS FICHEROS DEBERÍAN DE IR AQUÍ
    Ejemplo: const PROMPTS = require('../core/constants/prompts');
*/

const path = require('path');

module.exports = {
    dataDirectory: process.env.DATA_DIRECTORY || path.join(__dirname, '../../data'),
    jsonFilename: process.env.JSON_FILENAME || 'noticias.json'
};