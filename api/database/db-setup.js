const { sequelize } = require('./sequelize');
const { Periodico, Tema, PalabraClave, Noticia, testConnection, syncModels } = require('./modelos');

/*
#############
## SEEDERS ##
#############

Deberíamos de hacer una carpeta con los seeders (no mezclar código)
*/
const periodicosData = [// Inserts de los periódicos
  { nombre: 'El pais', url: 'https://elpais.com' },
  { nombre: 'El plural', url: 'https://www.elplural.com' },
  { nombre: 'ABC', url: 'https://www.abc.es' },
  { nombre: 'LibertadDigital', url: 'https://www.libertaddigital.com' }
];

const temasData = [// Inserts de los temas
  { nombre: 'Política y Gobierno' },
  { nombre: 'Economía y Finanzas' },
  { nombre: 'Sociedad y Cultura' },
  { nombre: 'Tecnología e Innovación' },
  { nombre: 'Salud y Ciencia' },
  { nombre: 'Medio Ambiente y Cambio Climático' },
  { nombre: 'Seguridad y Crimen' },
  { nombre: 'Deportes' },
  { nombre: 'Entretenimiento y Espectáculos' },
  { nombre: 'Educación y Formación' }
];

async function createDatabaseIfNotExists() { // Función para crear la base de datos sino existe
  const { host, username, password, database } = sequelize.config;
  
  try {
    const connection = await mysql.createConnection({
      host: host,
      user: username,
      password: password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    await connection.end();
    
    return true;

  } catch (error) {
    console.error('Error creating database:', error);
    return false;
  }
}

async function initializeDatabase() { // Función para iniciar la base de datos
  try {
    const dbCreated = await createDatabaseIfNotExists();
    if (!dbCreated) {
      console.error('Failed to create database. Exiting...');
      return;
    }
    
    await testConnection();
    await sequelize.sync({ force: true });
    
    console.log('Database schema created successfully');
    
    await Periodico.bulkCreate(periodicosData);
    await Tema.bulkCreate(temasData);
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main == module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };


//Ahora ejecutas esto: node /var/www/html/NewsHub/api/db-setup.js