const express = require('express');
const cors = require('cors');
const db = require('./app/database/db');
const bodyParser = require('body-parser');
const routes = require('./app/routes/index');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
}));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

db.testConnection()
    .then(() => {
        console.log('Database connected successfully');
        
        return db.syncModels();
    })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            const { networkInterfaces } = require('os');
            const nets = networkInterfaces();
            console.log('Available network addresses:');
            
            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    if (net.family == 'IPv4' && !net.internal) {
                        console.log(`   http://${net.address}:${PORT}`);
                    }
                }
            }
        });
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    });

process.on('SIGINT', () => {
    const sequelize = db.getSequelize();
    sequelize.close()
        .then(() => {
            console.log('Database disconnected');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error disconnecting from database:', err);
            process.exit(1);
        });
});

/*
1. Node server.js a este fichero
2. Ejecutar main.py
3. Usar post: http://localhost:3000/api/ai/analyze
4. Bajar a la bbdd: http://localhost:3000/api/noticias/almacenar-bbdd
*/