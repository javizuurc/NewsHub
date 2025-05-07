const path = require('path');

module.exports = {
    dataDirectory: process.env.DATA_DIRECTORY || path.join(__dirname, '../../data'),
    jsonFilename: process.env.JSON_FILENAME || 'noticias.json'
    //Crear uno para grupos.json
};