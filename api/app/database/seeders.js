const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');

const dbConfig = require('./config_db');

/*
#############
## SEEDERS ##
#############

Deberíamos de hacer una carpeta con los seeders (no mezclar código)
*/
const periodicosData = [// Inserts de los periódicos
  { nombre: 'El País', url: 'https://elpais.com' },
  { nombre: 'El Plural', url: 'https://www.elplural.com' },
  { nombre: 'ABC', url: 'https://www.abc.es' },
  { nombre: 'Libertad Digital', url: 'https://www.libertaddigital.com' },
  { nombre: 'Cinco Días', url: 'https://cincodias.elpais.com/'}
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
  const { host, database, username, password } = dbConfig;
  
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
    
    // Create a new Sequelize instance with explicit dialect
    const sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: 'mysql',
        logging: true
      }
    );
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Define models directly in this file for seeding purposes
    const Periodico = sequelize.define('Periodico', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Make nombre unique to help with upserts
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      tableName: 'periodicos',
      timestamps: false
    });
    
    const Tema = sequelize.define('Tema', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Make nombre unique to help with upserts
      }
    }, {
      tableName: 'temas',
      timestamps: false
    });
    
    // Usar alter: true en lugar de force: true para no eliminar las tablas
    await sequelize.sync({ alter: true });
    
    console.log('Database schema updated successfully');
    
    // Use individual upserts instead of bulkCreate
    console.log('Updating periodicos data...');
    
    // Process each periodico individually
    for (const periodico of periodicosData) {
      await Periodico.upsert(periodico, {
        where: { nombre: periodico.nombre }
      });
    }
    
    // Process each tema individually
    for (const tema of temasData) {
      await Tema.upsert(tema, {
        where: { nombre: tema.nombre }
      });
    }
    
    // Verify data was inserted/updated correctly
    const insertedPeriodicos = await Periodico.findAll();
    console.log('Updated periodicos:', JSON.stringify(insertedPeriodicos, null, 2));
    
    console.log('Database initialization completed successfully');
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error details:', error.stack);
  }
}

if (require.main == module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };

// Para ejecutar: node app/database/seeders.js