import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from scripts.scrapers.modelo_periodico import ModeloPeriodico



class ElPais(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.elpais.com")
    
    async def obtener_noticias_async(self):
        articulos = []
        vistos = set()  # Para almacenar titulares ya procesados
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.url, headers=self.headers) as respuesta:
                if respuesta.status == 200:
                    html = await respuesta.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    section = soup.find('section', class_='_g _g-lg _g-o b b-co') 
                    if section:
                        # Se itera sobre los elementos hijos directos de la sección
                        for sec in section.find_all(recursive=False):
                            h2_tags = sec.find_all('h2', class_='c_t')
                            for h2 in h2_tags:
                                a_tag = h2.find('a')
                                if a_tag:
                                    url_articulo = a_tag.get('href')
                                    async with session.get(url_articulo) as respuesta_articulo:
                                        if respuesta_articulo.status == 200:
                                            html_art = await respuesta_articulo.text()
                                            soup_art = BeautifulSoup(html_art, 'html.parser')
                                            autor_div = soup_art.find('div', class_='a_md_a')
                                            titulo_h1 = soup_art.find('h1')
                                            subtitulo_h2 = soup_art.find('h2')
                                            parrafo_p = soup_art.find('p')
                                            fecha_tag = soup_art.find('a', attrs={'data-date': True})
                                            fecha = fecha_tag['data-date'][:10] if fecha_tag else ''
                                            img_tag = soup_art.find('img', class_='_re  a_m-h') or soup_art.select_one('figure img')
                                            if img_tag and img_tag.has_attr('srcset'):
                                                srcset = img_tag['srcset']
                                                imagen_url = srcset.split(',')[-1].strip().split(' ')[0]
                                            else:
                                                imagen_url = img_tag.get('src') if img_tag and img_tag.has_attr('src') else ''
                                                
                                            datos = {
                                                'autor': autor_div.get_text(strip=True) if autor_div else '',
                                                'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                                'subtitulo': subtitulo_h2.get_text(strip=True) if subtitulo_h2 else '',
                                                'articulo': parrafo_p.get_text(strip=True) if parrafo_p else '',
                                                'url': url_articulo,
                                                'fecha_publicacion': fecha,
                                                'imagen': imagen_url
                                            }
                                            articulos.append(datos)
        return articulos
