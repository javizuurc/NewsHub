module.exports = (sequelize, DataTypes) => {
  const Grupo = sequelize.define('Grupo', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titular_general: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'grupos',
    timestamps: false
  });

  Grupo.associate = function(models) {
    Grupo.belongsToMany(models.Noticia, {
      through: 'grupo_noticia',
      foreignKey: 'grupo_id',
      otherKey: 'noticia_id'
    });
  };

  return Grupo;
};