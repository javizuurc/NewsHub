//npm install --save-dev jest
//npm install --save-dev supertest
//npm install --save-dev express
//nom run test:unit
const request = require('supertest');
const express = require('express');
const AlmacenamientoController = require('../../app/controllers/almacenamientoController');

// Mock del servicio
jest.mock('../..//app/services/almacenamientoService', () => {
    return jest.fn().mockImplementation(() => ({
        dataDir: '/mock/data',
        crearDirectorio: jest.fn(() => ({ success: true })),
        leerNoticiasJSON: jest.fn(() => ({ success: true, data: [] })),
        crearBackup: jest.fn(() => ({ success: true, message: 'Backup creado' })),
        insertarNoticiasJSON: jest.fn(() => ({ success: true })),
        eliminarContenidoJSON: jest.fn(() => ({ success: true, message: 'Archivo JSON reiniciado' })),
        sacarPalabrasClaves: jest.fn(() => ['política', 'economía', 'sociedad'])
    }));
});

// Instancia Express para test
const app = express();
app.use(express.json());

const controller = require('../../app/controllers/almacenamientoController');


app.get('/directorio', controller.getDataDirectory);
app.post('/crear-directorio', controller.createDataDirectory.bind(controller));
app.get('/json', controller.getJsonData.bind(controller));
app.post('/crear-backup', controller.createBackup.bind(controller));
app.post('/guardar', controller.guardarNoticiaJSON.bind(controller));
app.get('/leer-json', controller.leerJSON.bind(controller));
app.post('/crear-json', controller.crearJSON.bind(controller));
app.get('/palabras-clave', controller.obtenerPalabrasClave.bind(controller));

describe('AlmacenamientoController', () => {

    it('crea el directorio correctamente', async () => {
        const res = await request(app).post('/crear-directorio');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('lee el archivo JSON correctamente', async () => {
        const res = await request(app).get('/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('crea un backup correctamente', async () => {
        const res = await request(app).post('/crear-backup');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Backup creado');
    });

    it('guarda una noticia en JSON correctamente', async () => {
        const res = await request(app).post('/guardar').send({
            titulo: "Noticia de prueba",
            contenido: "Contenido de prueba",
            fecha: new Date()
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('lee JSON y crea si no existe', async () => {
        const res = await request(app).get('/leer-json?crear=true');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('reinicia el archivo JSON correctamente', async () => {
        const res = await request(app).post('/crear-json');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/reiniciado/i);
    });

    it('extrae palabras clave correctamente', async () => {
        const res = await request(app).get('/palabras-clave');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toContain('política');
    });

});
