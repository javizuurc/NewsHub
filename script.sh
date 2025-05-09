#!/bin/bash

set -e  # Hace que el script se detenga si ocurre un error

echo "🔧 Activando entorno virtual..."
source venv/bin/activate

echo "📰 Ejecutando main.py (scraping de noticias)..."
python3 api/scripts/scrapers/main.py

echo "🧠 Llamando a /api/ai/analyze (esto puede tardar hasta 10 minutos)..."
curl -X POST http://localhost:3000/api/ai/analyze

echo "🧪 Llamando a /api/storage/verificar-palabras-clave..."
curl -X POST http://localhost:3000/api/storage/verificar-palabras-clave

echo "💾 Llamando a /api/noticias/almacenar-bbdd..."
curl -X POST http://localhost:3000/api/noticias/almacenar-bbdd

echo "🧱 Ejecutando grupos.py (agrupación de noticias)..."
python3 api/scripts/grupos/grupos.py

echo "✅ Desactivando entorno virtual..."
deactivate

echo "🎉 Proceso completado con éxito."
