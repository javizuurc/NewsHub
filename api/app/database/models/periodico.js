module.exports = (sequelize, DataTypes) => {
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

  Periodico.associate = function(models) {
    this.hasMany(models.Noticia, { foreignKey: 'periodico_id' });
  };

  return Periodico;
};