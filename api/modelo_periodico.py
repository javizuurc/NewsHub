from bs4 import BeautifulSoup
import requests
import aiohttp
import asyncio

class ModeloPeriodico:
    def __init__(self, url):
        self.url = url
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            )
        }
        self.default_values = { # Valores predeterminados para la noticia
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
            'palabras_claves':    '',
            'coeficiente':        '',
            'posicion':           '',  # Si es de izquierdas, centro o derecha
            'justificacion':      '',  # Razones por las que la noticia tiene x posición
            'enfoque':            '',  # Relativo al tema, si está a favor, neutral o en contra del tema
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

        return noticia

    def guardar_noticias(self, periodico_nombre):
            noticias = self.obtener_noticias()

            if isinstance(noticias, list):
                for dato in noticias:
                    noticia = self.crear_noticia(periodico_nombre, dato)
                    self.enviar_a_api_noticias(noticia)

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
                    self.enviar_a_api_noticias(noticia)

    def enviar_a_api_noticias(self, noticia): # Enviar noticia (sync version)
        """
            Envía una noticia a los endpoints de la API:
            - Realiza un GET a '/noticias' para obtener la lista de periódicos.
            - Envía un POST a '/noticias' para crear la noticia.
        """
        get_url = 'http://localhost:3000/noticias'
        try:
            r_get = requests.get(get_url)
        except Exception as e:
            print("Error al llamar GET /noticias:", e)
    
        post_url = 'http://localhost:3000/noticias'
        try:
            r_post = requests.post(post_url, json=noticia)
            # Verificar si el código de estado está en el rango de éxito (200-299)
            if not (200 <= r_post.status_code < 300):
                print(f"Error al llamar POST /noticias: {r_post.status_code}")
        except Exception as e:
            print("Error al llamar POST /noticias:", e)
    
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

        if isinstance(noticias, list):
            for dato in noticias:
                noticia = self.crear_noticia(periodico_nombre, dato)
                await self.enviar_a_api_noticias_async(noticia)

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
                await self.enviar_a_api_noticias_async(noticia)

    async def enviar_a_api_noticias_async(self, noticia): # Enviar noticia (async version)
        """
            Envía una noticia a los endpoints de la API de forma asíncrona:
            - Realiza un GET a '/noticias' para obtener la lista de periódicos.
            - Envía un POST a '/noticias' para crear la noticia.
        """
        get_url = 'http://localhost:3000/noticias'
        post_url = 'http://localhost:3000/noticias'
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(get_url) as r_get:
                    pass  # Solo verificamos que el endpoint esté disponible
            except Exception as e:
                print("Error al llamar GET /noticias:", e)
    
            try:
                async with session.post(post_url, json=noticia) as r_post:
                    # Modificado: Ahora acepta códigos 200-299 como éxito
                    if not (200 <= r_post.status < 300):
                        print(f"Error al enviar POST /noticias: {r_post.status}")
            except Exception as e:
                print("Error al llamar POST /noticias:", e)



    # NOTA: De momento esta función no se usa
    def enviar_datos_a_express(self, datos):
        url_express = 'http://localhost:3000/guardar-noticia'  # URL de tu servidor Express.js
        try:
            response = requests.post(url_express, json=datos)
            print("Datos enviados correctamente a Express.js") if response.status_code == 200 else print(f"Error al enviar datos: {response.status_code}")
        except Exception as e:
            print(f"Error al enviar datos a Express.js: {e}")