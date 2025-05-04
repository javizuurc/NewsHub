const { Sequelize, Op } = require('sequelize');
const dbConfig = require('./config_db');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.sequelize = new Sequelize(
      dbConfig.database, 
      dbConfig.username, 
      dbConfig.password, 
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging
      }
    );

    this.models = {};
    this.initModels();
  }

  initModels() {
    const modelsDir = path.join(__dirname, 'models');
    
    try {
      fs.readdirSync(modelsDir)
        .filter(file => {
          return (file.indexOf('.') != 0) && 
                (file != 'index.js') && 
                (file.slice(-3) == '.js');
        })
        .forEach(file => {
          const model = require(path.join(modelsDir, file))(this.sequelize, Sequelize.DataTypes);
          this.models[model.name] = model;
        });
      
      Object.keys(this.models).forEach(modelName => {
        if (this.models[modelName].associate) {
          this.models[modelName].associate(this.models);
        }
      });
      
      console.log('Models initialized successfully');
    } catch (error) {
      console.error('Error initializing models:', error);
    }
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return true;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return false;
    }
  }


  async syncModels() {
    try {
      await this.sequelize.sync({ alter: true });
      console.log('Models synchronized with database.');
      return true;
    } catch (error) {
      console.error('Error synchronizing models:', error);
      return false;
    }
  }
  
  getSequelize() {
    return this.sequelize;
  }
  
  registerModel(modelName, model) {
    this.models[modelName] = model;
    return this.models[modelName];
  }
  
  getModel(modelName) {
    return this.models[modelName];
  }
}

async function buscarDuplicados(modelo, criterios, opciones = {}) {
  try {
    const sequelize = db.getSequelize();
    
    const config = {
      camposIndice: opciones.camposIndice || Object.keys(criterios),
      atributos: opciones.atributos || null
    };
    
    const condiciones = {
      where: {
        [Op.or]: []
      }
    };
    
    if (config.atributos) {
      condiciones.attributes = config.atributos;
    }
    
    Object.entries(criterios).forEach(([campo, valores]) => {
      if (valores && Array.isArray(valores) && valores.length > 0) {
        const condicion = {};
        condicion[campo] = { [Op.in]: valores };
        condiciones.where[Op.or].push(condicion);
      } else if (valores && !Array.isArray(valores)) {
        const condicion = {};
        condicion[campo] = valores;
        condiciones.where[Op.or].push(condicion);
      }
    });
    
    if (condiciones.where[Op.or].length == 0) {
      return {
        registros: [],
        indices: {}
      };
    }
    
    const registrosExistentes = await modelo.findAll(condiciones);
    
    const resultado = {
      registros: registrosExistentes,
      indices: {}
    };
    
    config.camposIndice.forEach(campo => {
      resultado.indices[campo] = {};
      
      registrosExistentes.forEach(registro => {
        const valor = registro[campo];
        if (valor != null && valor != undefined) {
          resultado.indices[campo][valor] = registro;
        }
      });
    });
    
    return resultado;
  } catch (error) {
    console.error("Error al buscar duplicados:", error);
    throw error;
  }
}

async function buscarNoticiasDuplicadas(modelo, criterios) {
  try {
    const criteriosGenericos = {};
    if (criterios.titulos && criterios.titulos.length > 0) {
      criteriosGenericos.titulo = criterios.titulos;
    }
    if (criterios.urls && criterios.urls.length > 0) {
      criteriosGenericos.url = criterios.urls;
    }
    
    const resultado = await buscarDuplicados(modelo, criteriosGenericos, {
      camposIndice: ['titulo', 'url']
    });
    
    return {
      noticias: resultado.registros,
      porTitulo: resultado.indices.titulo || {},
      porURL: resultado.indices.url || {}
    };
  } catch (error) {
    console.error("Error al buscar noticias duplicadas:", error);
    throw error;
  }
}

async function insertarRegistros(modelo, registros, opciones = {}) {
  try {
    const config = {
      camposComparacion: opciones.camposComparacion || ['id'],
      actualizarExistentes: opciones.actualizarExistentes != false,
      camposActualizables: opciones.camposActualizables || null,
      condicionPersonalizada: opciones.condicionPersonalizada || null
    };
    
    const resultados = {
      insertados: 0,
      actualizados: 0,
      errores: 0,
      detalles: []
    };
    
    if (!registros || !Array.isArray(registros) || registros.length === 0) {
      return resultados;
    }
    
    registros = registros.map(registro => {
      const registroLimpio = {...registro};

      ['fecha_publicacion', 'fecha_scraping'].forEach(campo => {
        if (registroLimpio[campo]) {
          if (registroLimpio[campo] == 'Invalid date' || registroLimpio[campo] == 'Invalid Date') {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            registroLimpio[campo] = hoy.toISOString().slice(0, 19).replace('T', ' ');
          } else {
            try {
              const fecha = new Date(registroLimpio[campo]);
              
              if (isNaN(fecha.getTime())) {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                registroLimpio[campo] = hoy.toISOString().slice(0, 19).replace('T', ' ');
              } else {
                registroLimpio[campo] = fecha.toISOString().slice(0, 19).replace('T', ' ');
              }
            } catch (e) {
              console.log(`Error parsing date for ${campo}:`, registroLimpio[campo]);
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              registroLimpio[campo] = hoy.toISOString().slice(0, 19).replace('T', ' ');
            }
          }
        } else {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          registroLimpio[campo] = hoy.toISOString().slice(0, 19).replace('T', ' ');
        }
      });
      
      return registroLimpio;
    });
    
    const criteriosBusqueda = {};
    
    config.camposComparacion.forEach(campo => {
      const valores = registros
        .map(r => r[campo])
        .filter(v => v !== null && v !== undefined);
      
      if (valores.length > 0) {
        criteriosBusqueda[campo] = valores;
      }
    });
    
    const existentes = await buscarDuplicados(modelo, criteriosBusqueda, {
      camposIndice: config.camposComparacion
    });
    
    const registrosParaInsertar = [];
    const actualizaciones = [];
    
    for (const registro of registros) {
      let existente = null;
      
      for (const campo of config.camposComparacion) {
        if (registro[campo] && existentes.indices[campo] && existentes.indices[campo][registro[campo]]) {
          existente = existentes.indices[campo][registro[campo]];
          break;
        }
      }
      
      if (existente && config.actualizarExistentes) {
        let actualizado = false;
        const camposActualizados = {};
        
        for (const campo in registro) {
          const esActualizable = !config.camposActualizables || config.camposActualizables.includes(campo);
          
          if (esActualizable && registro[campo] && 
              (!existente[campo] || existente[campo] === '' || existente[campo] === null)) {
            camposActualizados[campo] = registro[campo];
            actualizado = true;
          }
        }
        
        if (actualizado) {
          actualizaciones.push({
            modelo: existente,
            campos: camposActualizados,
            identificador: registro[config.camposComparacion[0]] || 'sin identificador'
          });
        }
      } else if (!existente) {
        registrosParaInsertar.push(registro);
      }
    }
    
    if (registrosParaInsertar.length > 0) {
      try {
        const nuevosRegistros = await modelo.bulkCreate(registrosParaInsertar);
        resultados.insertados = nuevosRegistros.length;
        
        nuevosRegistros.forEach(nuevoRegistro => {
          const campoIdentificador = config.camposComparacion[0];
          resultados.detalles.push({
            identificador: nuevoRegistro[campoIdentificador] || nuevoRegistro.id || 'sin identificador',
            accion: 'insertado',
            id: nuevoRegistro.id
          });
        });
      } catch (error) {
        console.error("Error en inserción masiva:", error);
        resultados.errores += registrosParaInsertar.length;
        throw error;
      }
    }
    
    if (actualizaciones.length > 0) {
      await Promise.all(actualizaciones.map(async (act) => {
        try {
          await act.modelo.update(act.campos);
          resultados.actualizados++;
          resultados.detalles.push({
            identificador: act.identificador,
            accion: 'actualizado',
            id: act.modelo.id
          });
        } catch (error) {
          console.error(`Error al actualizar registro "${act.identificador}":`, error);
          resultados.errores++;
          resultados.detalles.push({
            identificador: act.identificador,
            accion: 'error',
            error: error.message
          });
        }
      }));
    }
    
    return resultados;
  } catch (error) {
    console.error("Error al insertar registros:", error);
    throw error;
  }
}

async function existenRegistros(modelo, criterios, opciones = {}) {
  try {
    const config = {
      camposComparacion: opciones.camposComparacion || Object.keys(criterios),
      operador: opciones.operador || 'OR',
      exactMatch: opciones.exactMatch != false
    };
    
    const condiciones = {
      where: {}
    };
    
    if (config.operador.toUpperCase() == 'AND') {
      Object.entries(criterios).forEach(([campo, valor]) => {
        if (valor !== null && valor !== undefined) {
          if (config.exactMatch) {
            condiciones.where[campo] = valor;
          } else {
            if (typeof valor == 'string') {
              condiciones.where[campo] = { [Op.like]: `%${valor}%` };
            } else {
              condiciones.where[campo] = valor;
            }
          }
        }
      });
    } else {
      condiciones.where[Op.or] = [];
      
      Object.entries(criterios).forEach(([campo, valor]) => {
        if (valor != null && valor != undefined) {
          const condicion = {};
          
          if (config.exactMatch) {
            condicion[campo] = valor;
          } else {
            if (typeof valor === 'string') {
              condicion[campo] = { [Op.like]: `%${valor}%` };
            } else {
              condicion[campo] = valor;
            }
          }
          
          condiciones.where[Op.or].push(condicion);
        }
      });
      
      if (condiciones.where[Op.or].length == 0) {
        return {
          existe: false,
          cantidad: 0,
          registros: []
        };
      }
    }
    
    if (!opciones.obtenerRegistros) {
      condiciones.limit = 1;
    }
    
    const registros = await modelo.findAll(condiciones);
    
    return {
      existe: registros.length > 0,
      cantidad: registros.length,
      registros: opciones.obtenerRegistros ? registros : []
    };
  } catch (error) {
    console.error("Error al verificar existencia de registros:", error);
    throw error;
  }
}

const db = new Database();

module.exports = db;
module.exports.buscarDuplicados = buscarDuplicados;
module.exports.buscarNoticiasDuplicadas = buscarNoticiasDuplicadas;
module.exports.insertarRegistros = insertarRegistros;
module.exports.existenRegistros = existenRegistros;