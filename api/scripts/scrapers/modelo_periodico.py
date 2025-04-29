from bs4 import BeautifulSoup
import requests
import aiohttp
import asyncio
import json
import os
from datetime import datetime

class ModeloPeriodico:
    def __init__(self, url):
        self.url = url
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            )
        }
        # Configuración de URLs para la API
        self.api_urls = {
            'get_noticias': 'http://localhost:3000/api/noticias/scrap',
            'post_noticia': 'http://localhost:3000/api/noticias/guardar-noticia-json'  # Cambiado a /storage/
        }
        
        # Configuración para almacenamiento local
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data')
        self.json_file = os.path.join(self.data_dir, 'noticias.json')
        
        self.default_values = {
            'titulo':     '',
            'subtitulo':  '',

            'periodico':  '',
            'autor':      '',

            'articulo':   '',
            'url':        '',

            'fecha_publicacion':  '',
            'fecha_scraping':     '',

            # DATOS A PASAR A LA API (vacíos para las noticias enviadas)
            'temas':              '',
            'palabras_claves': {
                'comunes': [],
                'nombres_propios': []
            },
            'coeficiente':        '',
            'posicion':           '',
            'justificacion':      []
        }

    # Obtener noticias
    def fetch_html(self):
        try:
            response = requests.get(self.url, headers = self.headers)
            return BeautifulSoup(response.text, 'html.parser') if response.status_code == 200 else None
        except Exception as e:
            print(f"Error al obtener datos de {self.url}: {e}")
            return None
    
    def obtener_noticias(self):
        raise NotImplementedError("Las subclases deben implementar el método `obtener_titulares`.")
    
    # Procesar noticia
    def crear_noticia(self, periodico_nombre, dato):
        noticia = {}

        for clave, valor in self.default_values.items():
            noticia[clave] = dato.get(clave, valor)

        noticia['periodico'] = periodico_nombre # Asegurarnos de que el campo 'periodico' se asigne correctamente
        
        # Añadir fecha de scraping si no está presente
        if not noticia['fecha_scraping']:
            noticia['fecha_scraping'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return noticia

    # Método para guardar noticias localmente
    def guardar_noticia_local(self, noticia):
        try:
            # Asegurarse de que el directorio existe
            os.makedirs(self.data_dir, exist_ok=True)
            
            # Cargar noticias existentes o crear un array vacío
            noticias = []
            if os.path.exists(self.json_file):
                try:
                    with open(self.json_file, 'r', encoding='utf-8') as f:
                        noticias = json.load(f)
                except json.JSONDecodeError:
                    print(f"Error al decodificar el archivo JSON. Creando uno nuevo.")
            
            # Verificar si la noticia ya existe (por título y periódico)
            for i, n in enumerate(noticias):
                if n.get('titulo') == noticia.get('titulo') and n.get('periodico') == noticia.get('periodico'):
                    # Actualizar noticia existente
                    noticias[i] = noticia
                    break
            else:
                # Añadir nueva noticia
                noticias.append(noticia)
            
            # Guardar todas las noticias
            with open(self.json_file, 'w', encoding='utf-8') as f:
                json.dump(noticias, f, ensure_ascii=False, indent=2)
            
            return True
        except Exception as e:
            print(f"Error al guardar noticia localmente: {e}")
            return False

    def guardar_noticias(self, periodico_nombre):
        noticias = self.obtener_noticias()
        noticias_guardadas = 0

        if isinstance(noticias, list):
            for dato in noticias:
                noticia = self.crear_noticia(periodico_nombre, dato)
                if self.enviar_a_api_noticias(noticia) or self.guardar_noticia_local(noticia):
                    noticias_guardadas += 1

        elif isinstance(noticias, dict):
            for titular, resumen in noticias.items():
                noticia = self.crear_noticia(periodico_nombre, {
                    'titulo': titular,
                    'subtitulo': '',
                    'autor': '',
                    'articulo': resumen,
                    'url': '',
                    'fecha_publicacion': '',
                    'fecha_scraping': ''
                })
                if self.enviar_a_api_noticias(noticia) or self.guardar_noticia_local(noticia):
                    noticias_guardadas += 1
        
        return noticias_guardadas

    def enviar_a_api_noticias(self, noticia):
        get_url = self.api_urls['get_noticias']
        try:
            r_get = requests.get(get_url)
        except Exception as e:
            print(f"Error al llamar GET {get_url}:", e)
            return False
    
        post_url = self.api_urls['post_noticia']
        try:
            r_post = requests.post(post_url, json=noticia)
            if 200 <= r_post.status_code < 300:
                return True
            else:
                print(f"Error al llamar POST {post_url}: {r_post.status_code}")
                return False
        except Exception as e:
            print(f"Error al llamar POST {post_url}:", e)
            return False

    # Obtener noticias (async version)
    async def fetch_html_async(self, session, url):
        try:
            async with session.get(url, headers = self.headers) as response:
                if response.status == 200:
                    html = await response.text()
                    return BeautifulSoup(html, 'html.parser')
                return None
        except Exception as e:
            print(f"Error al obtener datos de {url}: {e}")
            return None

    async def obtener_noticias_async(self):
        raise NotImplementedError("Las subclases deben implementar el método `obtener_noticias_async`.")

    async def guardar_noticias_async(self, periodico_nombre):
        noticias = await self.obtener_noticias_async()
        noticias_guardadas = 0

        if isinstance(noticias, list):
            for dato in noticias:
                noticia = self.crear_noticia(periodico_nombre, dato)
                if await self.enviar_a_api_noticias_async(noticia) or self.guardar_noticia_local(noticia):
                    noticias_guardadas += 1

        elif isinstance(noticias, dict):
            for titular, resumen in noticias.items():
                noticia = self.crear_noticia(periodico_nombre, {
                    'titulo': titular,
                    'subtitulo': '',
                    'autor': '',
                    'articulo': resumen,
                    'url': '',
                    'fecha_publicacion': '',
                    'fecha_scraping': ''
                })
                if await self.enviar_a_api_noticias_async(noticia) or self.guardar_noticia_local(noticia):
                    noticias_guardadas += 1
        
        return noticias_guardadas

    async def enviar_a_api_noticias_async(self, noticia):
        get_url = self.api_urls['get_noticias']
        post_url = self.api_urls['post_noticia']
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(get_url) as r_get:
                    pass
            except Exception as e:
                print(f"Error al llamar GET {get_url}:", e)
                return False
    
            try:
                async with session.post(post_url, json=noticia) as r_post:
                    if 200 <= r_post.status < 300:
                        return True
                    else:
                        print(f"Error al enviar POST {post_url}: {r_post.status}")
                        return False
            except Exception as e:
                print(f"Error al llamar POST {post_url}:", e)
                return False
        
        return False

    # NOTA: De momento esta función no se usa
    def enviar_datos_a_express(self, datos):
        url_express = self.api_urls['post_noticia']
        try:
            response = requests.post(url_express, json=datos)
            print("Datos enviados correctamente a Express.js") if response.status_code == 200 else print(f"Error al enviar datos: {response.status_code}")
            return response.status_code == 200
        except Exception as e:
            print(f"Error al enviar datos a Express.js: {e}")
            return False
