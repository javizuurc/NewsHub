import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from modelo_periodico import ModeloPeriodico
'''
class ElDiario(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.eldiario.es")

    def obtener_noticias(self):
        articulos = []
        respuesta = requests.get(self.url)
        
        if respuesta.status_code == 200:
            soup    = BeautifulSoup(respuesta.text, 'html.parser')
            div     = soup.find('div', class_='grid-container container-ha-6')

            if div:
                h2_tags = div.find_all('h2')

                for h2 in h2_tags:

                    link = h2.find('a')
                    if link:
                        
                        url_articulo = link.get('href')
                        url_completo = 'https://www.eldiario.es' + url_articulo
                        respuesta_articulo = requests.get(url_completo)
                        
                        if respuesta_articulo.status_code == 200:
                            soup_art = BeautifulSoup(respuesta_articulo.text, 'html.parser')
                            
                            # Extracción de título, autor, subtítulo y contenido del artículo
                            titulo_h1 = soup_art.find('h1')
                            autor_p = soup_art.find('p', class_='authors')
                            subtitulo_h2 = soup_art.find('h2')
                            parrafos = soup_art.find_all('p', class_='article-text')
                            
                            # Concatenación del contenido del artículo
                            contenido_articulo = "\n".join([parrafo.get_text(strip=True) for parrafo in parrafos])
                            
                            # Estructura de datos del artículo
                            datos = {
                                'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                'autor': autor_p.get_text(strip=True) if autor_p else '',
                                'subtitulo': subtitulo_h2.get_text(strip=True) if subtitulo_h2 else '',
                                'articulo': contenido_articulo,
                                'url': url_completo
                            }
                            articulos.append(datos)
        
        return articulos
'''