import asyncio
import aiohttp
import re
from bs4 import BeautifulSoup
from datetime import datetime
from scripts.scrapers.modelo_periodico import ModeloPeriodico  # Cambio aquí

class LibertadDigital(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.libertaddigital.com")

    async def obtener_noticias_async(self):
        articulos = []

        async with aiohttp.ClientSession() as session:
            async with session.get(self.url, headers=self.headers) as respuesta:
                if respuesta.status == 200:
                    html = await respuesta.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    section = soup.find("section", class_="collage")

                    if section:
                        enlaces = section.find_all('a')
                        for enlace in enlaces:
                            url_articulo = enlace.get('href')
                            if not url_articulo.startswith("http"):
                                url_articulo = self.url + url_articulo

                            async with session.get(url_articulo, headers=self.headers) as respuesta_articulo:
                                if respuesta_articulo.status == 200:
                                    html_art = await respuesta_articulo.text()
                                    soup_art = BeautifulSoup(html_art, 'html.parser')

                                    # Título
                                    titulo_h1 = soup_art.find('h1')
                                    titulo = titulo_h1.get_text(strip=True) if titulo_h1 else ''

                                    # Autor
                                    autor_div = soup_art.find('div', class_='byline')
                                    autor_link = soup_art.find('a', class_='author')
                                    if autor_div:
                                        autor = autor_div.get_text(strip=True)
                                    elif autor_link:
                                        autor = autor_link.get_text(strip=True)
                                    else:
                                        autor = ''

                                    # Subtítulo
                                    subtitulo_h2 = soup_art.find('h2', class_="lede")
                                    subtitulo = subtitulo_h2.get_text(strip=True) if subtitulo_h2 else ''

                                    # Cuerpo del artículo
                                    parrafos_div = soup_art.find('div', class_='body')
                                    if parrafos_div:
                                        parrafos = parrafos_div.find_all('p')
                                        articulo = ' '.join([p.get_text(strip=True) for p in parrafos])
                                    else:
                                        articulo = ''

                                    # Fecha en formato YYYY-MM-DD
                                    fecha_iso = ''
                                    time_tag = soup_art.find('time')
                                    if time_tag:
                                        fecha_texto = time_tag.get_text(strip=True)
                                        match = re.match(r'(\d{1,2})/(\d{1,2})/(\d{4})', fecha_texto)
                                        if match:
                                            dia, mes, anio = match.groups()
                                            try:
                                                fecha_obj = datetime.strptime(f'{int(dia):02}/{int(mes):02}/{anio}', '%d/%m/%Y')
                                                fecha_iso = fecha_obj.strftime('%Y-%m-%d')
                                            except:
                                                pass
                                    img_tag = soup_art.select_one('picture img')
                                    imagen_url = img_tag['src'] if img_tag and img_tag.has_attr('src') else ''


                                    # Diccionario final
                                    datos = {
                                        'autor': autor,
                                        'titulo': titulo,
                                        'subtitulo': subtitulo,
                                        'articulo': articulo,
                                        'fecha_publicacion': fecha_iso,
                                        'url': url_articulo,
                                        'imagen': imagen_url
                                    }
                                    articulos.append(datos)

        return articulos
