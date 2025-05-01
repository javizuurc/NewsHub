import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from scripts.scrapers.modelo_periodico import ModeloPeriodico

class ABC(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.abc.es")

    async def obtener_noticias_async(self):
        articulos = []
        vistos = set()  # Para almacenar titulares ya procesados
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.url, headers=self.headers) as respuesta:
                if respuesta.status == 200:
                    html = await respuesta.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    section = soup.find('section', class_='voc-grid')
                    
                    if section:
                        divs = section.find_all('div')
                        
                        for div in divs:
                            articulos_div = div.find_all('article')
                            
                            for articulo in articulos_div:
                                link = articulo.find('a')
                                if link:
                                    url_articulo = link.get('href')
                                    
                                    if url_articulo not in vistos:
                                        vistos.add(url_articulo)
                                        
                                        async with session.get(url_articulo, headers=self.headers) as respuesta_articulo:
                                            if respuesta_articulo.status == 200:
                                                html_art = await respuesta_articulo.text()
                                                soup_art = BeautifulSoup(html_art, 'html.parser')
                                                
                                                titulo_h1 = soup_art.find('h1')
                                                autor_p = soup_art.find('p', class_='voc-author__name')
                                                subtitulos_h2 = soup_art.find_all('h2')
                                                parrafo_p = soup_art.find('p', class_='voc-p')
                                                time_tag = soup_art.find('time', class_='voc-author__time')
                                                fecha = time_tag['datetime'][:10] if time_tag else ''

                                                
                                                datos = {
                                                    'autor': autor_p.get_text(strip=True) if autor_p else '',
                                                    'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                                    'subtitulo': ' '.join([h2.get_text(strip=True) for h2 in subtitulos_h2]),
                                                    'articulo': parrafo_p.get_text(strip=True) if parrafo_p else '',
                                                    'url': url_articulo,
                                                    'fecha_publicacion': fecha
                                                }
                                                articulos.append(datos)
        return articulos
    
