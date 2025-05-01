import asyncio
import aiohttp
from bs4 import BeautifulSoup
from scripts.scrapers.modelo_periodico import ModeloPeriodico
from datetime import datetime  

class ElPlural(ModeloPeriodico):
    def __init__(self):
        super().__init__("https://www.elplural.com/politica/")

    async def obtener_noticias_async(self):
        articulos = []  
        
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
                                    
                                    h1 = soup1.find('h1')
                                    titulo = h1.get_text(strip=True) if h1 else ''
                                    

                                    autor_tag = soup1.find('span', class_='author')
                                    autor = autor_tag.get_text(strip=True) if autor_tag else ''
                                    
                                   
                                    h2 = soup1.find('h2')
                                    subtitulo = h2.get_text(strip=True) if h2 else ''
                                    
                                  
                                    body = soup1.find('div', class_='body-content')
                                    if body:
                                        parrafos = body.find_all('p')
                                        articulo = ' '.join([p.get_text(strip=True) for p in parrafos])
                                    else:
                                        articulo = ''

                                    time_tag = soup1.find('time', class_='time')
                                    fecha_hora = time_tag.get_text(strip=True) if time_tag else ''

                                    fecha_iso = ''
                                    if fecha_hora:
                                        try:
                                            fecha_obj = datetime.strptime(fecha_hora, '%d/%m/%Y - %H:%M')
                                            fecha_iso = fecha_obj.strftime('%Y-%m-%d')
                                        except ValueError:
                                            pass

                                   
                                    datos = {
                                        'autor': autor,
                                        'titulo': titulo,
                                        'subtitulo': subtitulo,
                                        'articulo': articulo,
                                        'url': url,
                                        'fecha_publicacion': fecha_iso
                                    }
                                   
                                    articulos.append(datos)
        
      
        return articulos