# NewsHub
NewsHub es una Aplicación Web innovadora cuyo objetivo principal es recopilar, analizar y representar información sobre noticias y temas de diferentes fuentes de periódicos, tomando en cuenta la ideología o sesgo informativo de cada medio. La aplicación permite a los usuarios comparar cómo diferentes medios de comunicación cubren la misma noticia o tema, identificando el posicionamiento de los medios y proporcionando un análisis sobre el sesgo ideológico presente en las informaciones.

## Documentación del proyecto
https://docs.google.com/document/d/1CNzkal4_TYdO_Cltzl5pIr4U0EK6EYD1JdwlewTcfgA/edit?usp=sharing

## Vídeo explicativo
Aquí el video

## Instalación del proyecto
### Requisitos del sistema
- **Node.js** y **npm**
- **Python**
- Servidor Web (**Apache o Nginx**)
- Sistema Gestor de Base de Datos: **MySQL**

#### 1. Actualice la máquina
```
sudo apt update && sudo apt upgrade
```

#### 2. Clone el repositorio
```
git@github.com:javizuurc/NewsHub.git

cd NewsHub
```

#### 3. Elimine el fichero package-lock.json (para evitar problemas)
```
sudo rm -rf package-lock.json
```

#### 4. Instale las dependencias de node
```
npm install
```

#### 5. En el directorio /api cree el fichero '.env'
Configure sus variables de entorno siguiendo la estructura que le proporcionamos:

```
ESTRUCTURA
```

#### 6. Inicie la API
```
node server.js
```

Una vez iniciado el servidor Express.js la aplicación está lista tanto para recibir noticias como para analizarlas.