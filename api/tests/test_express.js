const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const sinon = require('sinon');

// Importar el archivo express.js (ajustar la ruta según sea necesario)
const app = require('../express');

describe('API Express', () => {
  describe('GET /noticias', () => {
    it('debería devolver un array de noticias', async () => {
      const response = await request(app)
        .get('/noticias')
        .set('Accept', 'application/json');
      
      expect(response.status).to.equal(200);
      expect(response.headers['content-type']).to.include('json');
      expect(response.body).to.be.an('array');
    });
  });
  
  describe('POST /noticias', () => {
    it('debería crear una nueva noticia', async () => {
      const nuevaNoticia = {
        titulo: 'Título de Prueba',
        subtitulo: 'Subtítulo de Prueba',
        periodico: 'test_periodico',
        autor: 'Autor de Prueba',
        articulo: 'Contenido de prueba',
        url: 'https://test.com/article'
      };
      
      const response = await request(app)
        .post('/noticias')
        .send(nuevaNoticia)
        .set('Accept', 'application/json');
      
      expect(response.status).to.equal(200);
      expect(response.text).to.equal('Noticia creada');
      
      // Verificar que la noticia se agregó al array
      const getResponse = await request(app)
        .get('/noticias')
        .set('Accept', 'application/json');
      
      const noticiasArray = getResponse.body;
      const noticiasCreada = noticiasArray.find(n => n.titulo === 'Título de Prueba');
      expect(noticiasCreada).to.not.be.undefined;
      expect(noticiasCreada.periodico).to.equal('test_periodico');
    });
  });
  
  describe('POST /evaluar-noticia', () => {
    // Este test requiere mockear la llamada a OpenAI
    it('debería manejar correctamente una URL inválida', async () => {
      const request = {
        url: 'url-invalida'
      };
      
      const response = await request(app)
        .post('/evaluar-noticia')
        .send(request)
        .set('Accept', 'application/json');
      
      expect(response.status).to.equal(400);
    });
  });
  
  describe('Función simplificarJSON', () => {
    it('debería limpiar y parsear correctamente una respuesta JSON', () => {
      // Acceder a la función simplificarJSON a través del módulo exportado
      const simplificarJSON = app.simplificarJSON || (() => {});
      
      if (typeof simplificarJSON === 'function') {
        const jsonString = '```json\n{"key": "value"}\n```';
        const result = simplificarJSON(jsonString);
        
        expect(result).to.deep.equal({ key: 'value' });
      } else {
        // Si la función no está exportada, omitir la prueba
        this.skip();
      }
    });
    
    it('debería manejar errores de parseo', () => {
      const simplificarJSON = app.simplificarJSON || (() => {});
      
      if (typeof simplificarJSON === 'function') {
        const invalidJson = '```json\n{key: value}\n```';
        const result = simplificarJSON(invalidJson);
        
        expect(result).to.have.property('error');
      } else {
        this.skip();
      }
    });
  });
});