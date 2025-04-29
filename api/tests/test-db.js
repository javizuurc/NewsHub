require('dotenv').config();
const BBDD = require('./app/database/db.js');
const AlmacenamientoService = require('./app/services/almacenamientoService');

async function testInsertarRegistros() {
  try {
    console.log("Probando conexión a la base de datos...");
    const conexionExitosa = await BBDD.testConnection();
    
    if (!conexionExitosa) {
      console.error("No se pudo conectar a la base de datos");
      return;
    }
    
    console.log("Conexión exitosa. Probando almacenamiento de noticias...");
    
    const almacenamiento = new AlmacenamientoService();
    const resultado = await almacenamiento.almacenarNoticiaBBDD();
    
    console.log("\n--- RESULTADOS DEL ALMACENAMIENTO ---");
    console.log(JSON.stringify(resultado, null, 2));
    
  } catch (error) {
    console.error("Error durante la prueba:", error);
  }
}

// Ejecutar la prueba
testInsertarRegistros()
  .then(() => console.log("Prueba completada"))
  .catch(err => console.error("Error en la prueba:", err));