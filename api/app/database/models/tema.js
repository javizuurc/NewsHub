module.exports = (sequelize, DataTypes) => {
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

  Tema.associate = function(models) {
    Tema.belongsToMany(models.Noticia, { through: 'noticias_temas', foreignKey: 'tema_id' });
  };

  return Tema;
};