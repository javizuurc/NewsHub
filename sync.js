const db = require('../app/database/db');

db.sequelize.sync({ alter: true })  // Cambiár { force: true } para borrar todo
  .then(() => {
    console.log('Tablas sincronizadas correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error al sincronizar las tablas:', error);
    process.exit(1);
  });
