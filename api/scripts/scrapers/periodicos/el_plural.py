import asyncio
import aiohttp
from bs4 import BeautifulSoup
from scripts.scrapers.modelo_periodico import ModeloPeriodico  # Cambio aquí

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