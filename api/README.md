# Notic.ia API 🗞️  
*API modular para consulta y análisis de noticias*

```bash
/Api/
├── 📄 .env
├── 📄 package.json
├── 📄 set_up.sh
├── 📁 app/                      # Código fuente principal
│   ├── 📁 core/                 # Funcionalidades centrales
│   │   ├── 📁 constants/        # Constantes compartidas
│   │   │   └── 📄 prompts.js    # Prompts de OpenAI
│   │   └── 📁 utils/            # Utilidades
│   │       ├── 📄 helpers.js    # Funciones auxiliares
│   │       └── 📄 logger.js     # Sistema de logging
│   ├── 📁 database/             # Configuración DB
│   │   ├── 📄 config.js         # Conexión DB
│   │   ├── 📁 models/           # Modelos Sequelize
│   │   │   ├── 📄 Noticia.js
│   │   │   ├── 📄 Periodico.js
│   │   │   └── 📄 Tema.js
│   │   └── 📁 seeders/          # Datos iniciales
│   │       └── 📄 initialData.js
│   ├── 📁 services/             # Lógica de negocio
│   │   ├── 📄 newsService.js    # Gestión noticias
│   │   ├── 📄 aiService.js      # Servicio OpenAI
│   │   └── 📄 storageService.js # Almacenamiento
│   ├── 📁 routes/               # Definición de endpoints
│   │   ├── 📄 news.routes.js
│   │   ├── 📄 analysis.routes.js
│   │   └── 📄 index.js          # Router principal
│   ├── 📁 controllers/          # Controladores
│   │   ├── 📄 newsController.js
│   │   └── 📄 analysisController.js
│   └── 📁 middlewares/          # Middlewares
│       ├── 📄 errorHandler.js
│       ├── 📄 validation.js
│       └── 📄 auth.js           # Auth (JWT/OAuth)
├── 📁 scripts/                  # Scripts auxiliares
│   ├── 📁 scrapers/             # Scrapers Python
│   │   ├── 📄 main.py
│   │   ├── 📄 modelo_periodico.py
│   │   └── 📄 periodicos.py
│   └── 📁 database/             # Migraciones
│       └── 📁 migrations/       # Historial DB
├── 📁 tests/                    # Pruebas
│   ├── 📁 unit/                 # Tests unitarios
│   └── 📁 integration/          # Tests integración
└── 📄 server.js                 # Entry point


✨ Cómo documentar la API con Swagger

🔍 Ejemplo completo de un endpoint con tests

🤖 Integración avanzada con los scrapers Python

## Mejoras noticIA
1. Mirar el código y quitar los comentarios IA
2. Reducir el número de funciones por clase (seguir la filosofía)
3. Implementar middleware (auth mediante ip para el tema de ejecutar scraps, openAI...)
4. Crear clases genéricas (modelo, service, controller, routes...)