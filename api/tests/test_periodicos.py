import unittest
from unittest.mock import patch, MagicMock, AsyncMock
import sys
import os
import asyncio

# Añadir el directorio api al path de Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from periodicos import ABC, ElPais, ElPlural, LibertadDigital

class TestABC(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.abc = ABC()
    
    def test_init(self):
        """Prueba que la inicialización establece correctamente la URL"""
        self.assertEqual(self.abc.url, "https://www.abc.es")
    
    @patch('aiohttp.ClientSession.get')
    async def test_obtener_noticias_async(self, mock_get):
        """Prueba que obtener_noticias_async extrae correctamente los datos de las noticias"""
        # Mock para la respuesta de la página principal
        main_response = AsyncMock()
        main_response.status = 200
        main_response.text.return_value = """
        <html>
            <body>
                <section class="voc-grid">
                    <div>
                        <article>
                            <a href="https://www.abc.es/article1">Artículo 1</a>
                        </article>
                    </div>
                </section>
            </body>
        </html>
        """
        
        # Mock para la respuesta de la página del artículo
        article_response = AsyncMock()
        article_response.status = 200
        article_response.text.return_value = """
        <html>
            <body>
                <h1>Título del Artículo de Prueba</h1>
                <p class="voc-author__name">Autor de Prueba</p>
                <h2>Subtítulo 1</h2>
                <h2>Subtítulo 2</h2>
                <p class="voc-p">Contenido del artículo de prueba</p>
            </body>
        </html>
        """
        
        # Configurar el mock para devolver diferentes respuestas
        mock_get.side_effect = lambda url, headers: AsyncMock(
            __aenter__=AsyncMock(
                return_value=main_response if url == "https://www.abc.es" else article_response
            )
        )
        
        result = await self.abc.obtener_noticias_async()
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['titulo'], 'Título del Artículo de Prueba')
        self.assertEqual(result[0]['autor'], 'Autor de Prueba')
        self.assertEqual(result[0]['subtitulo'], 'Subtítulo 1 Subtítulo 2')
        self.assertEqual(result[0]['articulo'], 'Contenido del artículo de prueba')
        self.assertEqual(result[0]['url'], 'https://www.abc.es/article1')


class TestElPais(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.elpais = ElPais()
    
    def test_init(self):
        """Prueba que la inicialización establece correctamente la URL"""
        self.assertEqual(self.elpais.url, "https://www.elpais.com")
    
    @patch('aiohttp.ClientSession.get')
    async def test_obtener_noticias_async(self, mock_get):
        """Prueba que obtener_noticias_async extrae correctamente los datos de las noticias"""
        # Mock para la respuesta de la página principal
        main_response = AsyncMock()
        main_response.status = 200
        main_response.text.return_value = """
        <html>
            <body>
                <section class="_g _g-md _g-o b b-d">
                    <div>
                        <h2 class="c_t"><a href="https://elpais.com/article1">Artículo 1</a></h2>
                    </div>
                </section>
            </body>
        </html>
        """
        
        # Mock para la respuesta de la página del artículo
        article_response = AsyncMock()
        article_response.status = 200
        article_response.text.return_value = """
        <html>
            <body>
                <h1>Título del Artículo de El País</h1>
                <div class="a_md_a">Autor de El País</div>
                <h2>Subtítulo de El País</h2>
                <p>Contenido del artículo de El País</p>
            </body>
        </html>
        """
        
        # Configurar el mock para devolver diferentes respuestas
        mock_get.side_effect = lambda url, headers: AsyncMock(
            __aenter__=AsyncMock(
                return_value=main_response if url == "https://www.elpais.com" else article_response
            )
        )
        
        result = await self.elpais.obtener_noticias_async()
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['titulo'], 'Título del Artículo de El País')
        self.assertEqual(result[0]['autor'], 'Autor de El País')
        self.assertEqual(result[0]['subtitulo'], 'Subtítulo de El País')
        self.assertEqual(result[0]['articulo'], 'Contenido del artículo de El País')
        self.assertEqual(result[0]['url'], 'https://elpais.com/article1')


class TestElPlural(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.elplural = ElPlural()
    
    def test_init(self):
        """Prueba que la inicialización establece correctamente la URL"""
        self.assertEqual(self.elplural.url, "https://www.elplural.com/politica/")
    
    @patch('aiohttp.ClientSession.get')
    async def test_obtener_noticias_async(self, mock_get):
        """Prueba que obtener_noticias_async extrae correctamente los datos de las noticias"""
        # Mock para la respuesta de la página principal
        main_response = AsyncMock()
        main_response.status = 200
        main_response.text.return_value = """
        <html>
            <body>
                <div class="text">
                    <a href="https://www.elplural.com/article1">Artículo 1</a>
                </div>
            </body>
        </html>
        """
        
        # Mock para la respuesta de la página del artículo
        article_response = AsyncMock()
        article_response.status = 200
        article_response.text.return_value = """
        <html>
            <body>
                <h1>Título del Artículo de El Plural</h1>
                <span class="author">Autor de El Plural</span>
                <h2>Subtítulo de El Plural</h2>
                <div class="body-content">
                    <p>Párrafo 1 de El Plural</p>
                    <p>Párrafo 2 de El Plural</p>
                </div>
            </body>
        </html>
        """
        
        # Configurar el mock para devolver diferentes respuestas
        mock_get.side_effect = lambda url, headers: AsyncMock(
            __aenter__=AsyncMock(
                return_value=main_response if url == "https://www.elplural.com/politica/" else article_response
            )
        )
        
        result = await self.elplural.obtener_noticias_async()
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['titulo'], 'Título del Artículo de El Plural')
        self.assertEqual(result[0]['autor'], 'Autor de El Plural')
        self.assertEqual(result[0]['subtitulo'], 'Subtítulo de El Plural')
        self.assertEqual(result[0]['articulo'], 'Párrafo 1 de El Plural Párrafo 2 de El Plural')
        self.assertEqual(result[0]['url'], 'https://www.elplural.com/article1')


class TestLibertadDigital(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.libertad_digital = LibertadDigital()
    
    def test_init(self):
        """Prueba que la inicialización establece correctamente la URL"""
        self.assertEqual(self.libertad_digital.url, "https://www.libertaddigital.com")
    
    @patch('aiohttp.ClientSession.get')
    async def test_obtener_noticias_async(self, mock_get):
        """Prueba que obtener_noticias_async extrae correctamente los datos de las noticias"""
        # Mock para la respuesta de la página principal
        main_response = AsyncMock()
        main_response.status = 200
        main_response.text.return_value = """
        <html>
            <body>
                <section class="collage">
                    <a href="/article1">Artículo 1</a>
                </section>
            </body>
        </html>
        """
        
        # Mock para la respuesta de la página del artículo
        article_response = AsyncMock()
        article_response.status = 200
        article_response.text.return_value = """
        <html>
            <body>
                <h1>Título del Artículo de Libertad Digital</h1>
                <div class="byline">Autor de Libertad Digital</div>
                <h2 class="lede">Subtítulo de Libertad Digital</h2>
                <div class="body">
                    <p>Párrafo 1 de Libertad Digital</p>
                    <p>Párrafo 2 de Libertad Digital</p>
                </div>
            </body>
        </html>
        """
        
        # Configurar el mock para devolver diferentes respuestas
        mock_get.side_effect = lambda url, headers: AsyncMock(
            __aenter__=AsyncMock(
                return_value=main_response if url == "https://www.libertaddigital.com" else article_response
            )
        )
        
        result = await self.libertad_digital.obtener_noticias_async()
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['titulo'], 'Título del Artículo de Libertad Digital')
        self.assertEqual(result[0]['autor'], 'Autor de Libertad Digital')
        self.assertEqual(result[0]['subtitulo'], 'Subtítulo de Libertad Digital')
        self.assertEqual(result[0]['articulo'], 'Párrafo 1 de Libertad Digital Párrafo 2 de Libertad Digital')
        self.assertEqual(result[0]['url'], 'https://www.libertaddigital.com/article1')


if __name__ == '__main__':
    unittest.main()