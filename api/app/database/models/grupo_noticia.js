module.exports = (sequelize, DataTypes) => {
    const GrupoNoticia = sequelize.define('GrupoNoticia', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grupo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'grupos',
          key: 'id'
        }
      },
      noticia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'noticias',
          key: 'id'
        }
      }
    }, {
      tableName: 'grupo_noticia',
      timestamps: false
    });
  
    return GrupoNoticia;
  };
  