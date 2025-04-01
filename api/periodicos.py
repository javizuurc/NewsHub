import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from modelo_periodico import ModeloPeriodico

class ABC(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.abc.es")

    def obtener_noticias(self):
        articulos = []
        headers = {         
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            )
        }
        respuesta = requests.get(self.url, headers=headers)
        vistos = set()  # Para almacenar titulares ya procesados

        if respuesta.status_code == 200:
            soup    = BeautifulSoup(respuesta.text, 'html.parser')

            section = soup.find('section', class_='voc-grid')

            if section:
                divs = section.find_all('div')

                for div in divs:
                    articulos_div = div.find_all('article')

                    for articulo in articulos_div:
                        link            = articulo.find('a')
                        url_articulo    = link.get('href')

                        if url_articulo not in vistos:
                            vistos.add(url_articulo)
                            respuesta_articulo = requests.get(url_articulo, headers=headers)

                            if respuesta_articulo.status_code == 200:
                                soup_art = BeautifulSoup(respuesta_articulo.text, 'html.parser')
                                
                                titulo_h1, autor_p, subtitulos_h2, parrafo_p = soup_art.find('h1'), soup_art.find('p', class_='voc-author__name'), soup_art.find_all('h2'), soup_art.find('p', class_='voc-p')

                                datos = {
                                    'autor':        autor_p.get_text(strip=True) if autor_p else '',
                                    'titulo':       titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                    'subtitulo':    ' '.join([h2.get_text(strip=True) for h2 in subtitulos_h2]),
                                    'articulo':     parrafo_p.get_text(strip=True) if parrafo_p else '',
                                    'url':          url_articulo
                                }
                                articulos.append(datos)
        return articulos
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

class ElPais(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.elpais.com")

    def obtener_noticias(self):
        articulos = []
        respuesta = requests.get(self.url)
        if respuesta.status_code == 200:
            soup = BeautifulSoup(respuesta.text, 'html.parser')
            section = soup.find('section', class_='_g _g-md _g-o b b-d')
            if section:
                for sec in section.find_all(recursive=False): # Se itera sobre los elementos hijos directos de la sección
                    h2_tags = sec.find_all('h2', class_='c_t')
                    for h2 in h2_tags:
                        a_tag = h2.find('a')
                        if a_tag:
                            url_articulo = a_tag.get('href')
                            respuesta_articulo = requests.get(url_articulo)
                            if respuesta_articulo.status_code == 200:
                                soup_art = BeautifulSoup(respuesta_articulo.text, 'html.parser')
                                
                                autor_div = soup_art.find('div', class_='a_md_a')
                                titulo_h1 = soup_art.find('h1')
                                subtitulo_h2 = soup_art.find('h2')
                                parrafo_p = soup_art.find('p')
                                
                                datos = {
                                    'autor': autor_div.get_text(strip=True) if autor_div else '',
                                    'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                    'subtitulo': subtitulo_h2.get_text(strip=True) if subtitulo_h2 else '',
                                    'articulo': parrafo_p.get_text(strip=True) if parrafo_p else '',
                                    'url': url_articulo
                                }
                                articulos.append(datos)
        return articulos
    
    async def obtener_noticias_async(self):
        articulos = []
        vistos = set()  # Para almacenar titulares ya procesados
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.url, headers=self.headers) as respuesta:
                if respuesta.status == 200:
                    html = await respuesta.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    section = soup.find('section', class_='_g _g-md _g-o b b-d')
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
                                            
                                            datos = {
                                                'autor': autor_div.get_text(strip=True) if autor_div else '',
                                                'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                                'subtitulo': subtitulo_h2.get_text(strip=True) if subtitulo_h2 else '',
                                                'articulo': parrafo_p.get_text(strip=True) if parrafo_p else '',
                                                'url': url_articulo
                                            }
                                            articulos.append(datos)
        return articulos

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
                                                
                                                datos = {
                                                    'autor': autor_p.get_text(strip=True) if autor_p else '',
                                                    'titulo': titulo_h1.get_text(strip=True) if titulo_h1 else '',
                                                    'subtitulo': ' '.join([h2.get_text(strip=True) for h2 in subtitulos_h2]),
                                                    'articulo': parrafo_p.get_text(strip=True) if parrafo_p else '',
                                                    'url': url_articulo
                                                }
                                                articulos.append(datos)
        return articulos

class ElPlural(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.elplural.com/politica/")

    async def obtener_noticias_async(self):
        articulos = []  # Lista para guardar los datos de los artículos
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.url, headers=self.headers) as respuesta:
                if respuesta.status == 200:
                    html = await respuesta.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    div = soup.find_all('div', class_='text')
                    
                    for i in div:
                        link = i.find('a')
                        if link:
                            url = link.get('href')
                            
                            async with session.get(url, headers=self.headers) as respuesta_articulos:
                                if respuesta_articulos.status == 200:
                                    html_art = await respuesta_articulos.text()
                                    soup1 = BeautifulSoup(html_art, 'html.parser')
                                    
                                    # Obtiene el título
                                    h1 = soup1.find('h1')
                                    titulo = h1.get_text(strip=True) if h1 else ''
                                    
                                    # Obtiene el autor
                                    autor_tag = soup1.find('span', class_='author')
                                    autor = autor_tag.get_text(strip=True) if autor_tag else ''
                                    
                                    # Obtiene el subtítulo
                                    h2 = soup1.find('h2')
                                    subtitulo = h2.get_text(strip=True) if h2 else ''
                                    
                                    # Obtiene el cuerpo del artículo
                                    body = soup1.find('div', class_='body-content')
                                    if body:
                                        parrafos = body.find_all('p')
                                        articulo = ' '.join([p.get_text(strip=True) for p in parrafos])
                                    else:
                                        articulo = ''

                                    # Crea un diccionario con los datos del artículo
                                    datos = {
                                        'autor': autor,
                                        'titulo': titulo,
                                        'subtitulo': subtitulo,
                                        'articulo': articulo,
                                        'url': url
                                    }
                                    # Agrega el diccionario a la lista de artículos
                                    articulos.append(datos)
        
        # Retorna la lista de artículos
        return articulos

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
                                    
                                    # Obtiene el título
                                    titulo_h1 = soup_art.find('h1')
                                    titulo = titulo_h1.get_text(strip=True) if titulo_h1 else ''
                                    
                                    # Obtiene el autor
                                    autor_div = soup_art.find('div', class_='byline')
                                    autor_link = soup_art.find('a', class_='author')
                                    if autor_div:
                                        autor = autor_div.get_text(strip=True)
                                    elif autor_link:
                                        autor = autor_link.get_text(strip=True)
                                    else:
                                        autor = ''
                                    
                                    # Obtiene el subtítulo
                                    subtitulo_h2 = soup_art.find('h2', class_="lede")
                                    subtitulo = subtitulo_h2.get_text(strip=True) if subtitulo_h2 else ''
                                    
                                    # Obtiene el cuerpo del artículo
                                    parrafos_div = soup_art.find('div', class_='body')
                                    if parrafos_div:
                                        parrafos = parrafos_div.find_all('p')
                                        articulo = ' '.join([p.get_text(strip=True) for p in parrafos])
                                    else:
                                        articulo = ''

                                    # Guarda los datos en un diccionario
                                    datos = {
                                        'autor': autor,
                                        'titulo': titulo,
                                        'subtitulo': subtitulo,
                                        'articulo': articulo,
                                        'url': url_articulo
                                    }
                                    articulos.append(datos)
        
        # Retorna la lista de artículos
        return articulos
