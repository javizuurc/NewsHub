module.exports = (sequelize, DataTypes) => {
  const Clave = sequelize.define('Clave', {
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
    tableName: 'claves',
    timestamps: false
  });

  Clave.associate = function(models) {
    this.belongsToMany(models.Noticia, { through: 'noticias_claves', foreignKey: 'clave_id' });
  };

  return Clave;
};