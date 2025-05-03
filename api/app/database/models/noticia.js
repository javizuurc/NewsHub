module.exports = (sequelize, DataTypes) => {
  const Noticia = sequelize.define('Noticia', {
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
    imagen: {
      type: DataTypes.TEXT,
    },
    coeficiente: {
      type: DataTypes.STRING
    },
    justificacion: {
      type: DataTypes.TEXT
    },
    periodico_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'periodicos',
        key: 'id'
      }
    }
  }, {
    tableName: 'noticias',
    timestamps: false
  });

  Noticia.associate = function(models) {
    Noticia.belongsTo(models.Periodico, { foreignKey: 'periodico_id' });
    Noticia.belongsToMany(models.Tema,  { through: 'noticias_temas',  foreignKey: 'noticia_id' });
    Noticia.belongsToMany(models.Clave, { through: 'noticias_claves', foreignKey: 'noticia_id' });
    Noticia.belongsToMany(models.Grupo, { through: 'grupo_noticia',   foreignKey: 'noticia_id', otherKey: 'grupo_id' });
  };

  return Noticia;
};