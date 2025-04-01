#!/bin/bash
echo "Ejecutando Pruebas Unitarias de la API de NewsHub..."

# Crear directorio para el entorno virtual con permisos adecuados
mkdir -p ~/.venvs/newshub

# Crear y activar entorno virtual si no existe
if [ ! -d "~/.venvs/newshub" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv ~/.venvs/newshub
fi

# Activar el entorno virtual
source ~/.venvs/newshub/bin/activate

# Instalar dependencias de Python
echo "Instalando dependencias de Python..."
pip install beautifulsoup4 aiohttp requests pytest pytest-asyncio

# Instalar dependencias de Node.js
echo "Instalando dependencias de Node.js..."
cd ..
npm install --no-save mocha chai supertest sinon esm
cd tests

# Configurar Python para usar el __pycache__ de la carpeta principal
# Establecer la variable PYTHONPATH para que apunte al directorio principal
export PYTHONPATH=$PYTHONPATH:$(cd .. && pwd)

# Establecer la variable PYTHONCACHEPREFIX para compartir la caché
export PYTHONCACHEPREFIX=$(cd .. && pwd)/__pycache__

echo
echo "Ejecutando Pruebas de Modelo..."
python -m unittest test_modelo.py

#echo
#echo "Ejecutando Pruebas de Periódicos..."
#python -m unittest test_periodicos.py

#echo
#echo "Ejecutando Pruebas de Main..."
#python -m unittest test_main.py

#echo
#echo "Ejecutando Pruebas de Express..."
#cd ..
#npx mocha --require esm tests/test_express.js
#cd tests

echo
echo "¡Todas las pruebas completadas!"

# Desactivar entorno virtual
deactivate