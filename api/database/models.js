// Inicio del ORM
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('./config_db');

const sequelize = new Sequelize(
  dbConfig.database, 
  dbConfig.username, 
  dbConfig.password, 
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

// Definir los modelos
const Periodico = sequelize.define('Periodico', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'periodicos',
  timestamps: false
});

const Tema = sequelize.define('Tema', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'temas',
  timestamps: false
});

const PalabraClave = sequelize.define('PalabraClave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  palabra: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'palabras_clave',
  timestamps: false
});

const Noticia = sequelize.define('noticias', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subtitulo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  autor: {
    type: DataTypes.STRING(100)
  },
  articulo: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.STRING(255)
  },
  fecha_publicacion: {
    type: DataTypes.DATE
  },
  fecha_scraping: {
    type: DataTypes.DATE
  },
  coeficiente: {
    type: DataTypes.STRING
  },
  justificacion: {
    type: DataTypes.TEXT
  },
  temas: {
    type: DataTypes.STRING
  },
  palabras_claves: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'noticias',
  timestamps: false
});

Noticia.belongsTo(Periodico,    { foreignKey: 'periodico_id' });
Periodico.hasMany(Noticia,      { foreignKey: 'periodico_id' });

Noticia.belongsToMany(Tema, { through: 'noticia_temas', foreignKey: 'noticia_id' });
Tema.belongsToMany(Noticia, { through: 'noticia_temas', foreignKey: 'tema_id' });

Noticia.belongsToMany(PalabraClave, { through: 'noticia_palabras_clave', foreignKey: 'noticia_id' });
PalabraClave.belongsToMany(Noticia, { through: 'noticia_palabras_clave', foreignKey: 'palabra_id' });

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Models synchronized with database.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

module.exports = {
  sequelize,
  Periodico,
  Tema,
  PalabraClave,
  Noticia,
  testConnection,
  syncModels
};