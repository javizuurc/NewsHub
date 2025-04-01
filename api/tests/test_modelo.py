import unittest
from unittest.mock import patch, MagicMock, AsyncMock
import sys
import os
import asyncio

# Añadir el directorio api al path de Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modelo import ModeloPeriodico

class TestModeloPeriodico(unittest.TestCase):
    def setUp(self):
        self.modelo = ModeloPeriodico("https://test.com")
    
    def test_init(self):
        """Prueba que la inicialización establece correctamente los atributos"""
        self.assertEqual(self.modelo.url, "https://test.com")
        self.assertIn("User-Agent", self.modelo.headers)
        self.assertIsInstance(self.modelo.default_values, dict)
    
    def test_crear_noticia(self):
        """Prueba que el método crear_noticia funciona correctamente"""
        periodico_nombre = "test_periodico"
        dato = {
            'titulo': 'Título de Prueba',
            'subtitulo': 'Subtítulo de Prueba',
            'autor': 'Autor de Prueba',
            'articulo': 'Contenido del Artículo de Prueba',
            'url': 'https://test.com/article',
        }
        
        noticia = self.modelo.crear_noticia(periodico_nombre, dato)
        
        # Verificar que los datos proporcionados se asignan correctamente
        self.assertEqual(noticia['titulo'], 'Título de Prueba')
        self.assertEqual(noticia['subtitulo'], 'Subtítulo de Prueba')
        self.assertEqual(noticia['autor'], 'Autor de Prueba')
        self.assertEqual(noticia['articulo'], 'Contenido del Artículo de Prueba')
        self.assertEqual(noticia['url'], 'https://test.com/article')
        
        # Verificar que el nombre del periódico se asigna correctamente
        self.assertEqual(noticia['periodico'], 'test_periodico')
        
        # Verificar que los valores predeterminados se aplican para campos no proporcionados
        self.assertEqual(noticia['coeficiente'], '')
        self.assertEqual(noticia['posicion'], '')
        self.assertEqual(noticia['fecha_publicacion'], '')
    
    @patch('requests.get')
    def test_fetch_html_success(self, mock_get):
        """Prueba que fetch_html funciona correctamente cuando la solicitud es exitosa"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = "<html><body>Test Content</body></html>"
        mock_get.return_value = mock_response
        
        result = self.modelo.fetch_html()
        
        self.assertIsNotNone(result)
        self.assertEqual(result.text, "Test Content")
        mock_get.assert_called_once_with("https://test.com", headers=self.modelo.headers)
    
    @patch('requests.get')
    def test_fetch_html_failure(self, mock_get):
        """Prueba que fetch_html maneja correctamente los errores"""
        mock_get.side_effect = Exception("Error de conexión")
        
        result = self.modelo.fetch_html()
        
        self.assertIsNone(result)
    
    @patch('requests.post')
    @patch('requests.get')
    def test_enviar_a_api_noticias(self, mock_get, mock_post):
        """Prueba que enviar_a_api_noticias envía correctamente los datos a la API"""
        mock_get.return_value = MagicMock()
        mock_post.return_value = MagicMock()
        
        noticia = {
            'titulo': 'Título de Prueba',
            'periodico': 'test_periodico',
            'url': 'https://test.com/article'
        }
        
        self.modelo.enviar_a_api_noticias(noticia)
        
        mock_get.assert_called_once_with('http://localhost:3000/noticias')
        mock_post.assert_called_once_with('http://localhost:3000/noticias', json=noticia)
    
    @patch('requests.post')
    def test_enviar_a_api_noticias_error(self, mock_post):
        """Prueba que enviar_a_api_noticias maneja correctamente los errores"""
        mock_post.side_effect = Exception("Error de API")
        
        noticia = {
            'titulo': 'Título de Prueba',
            'periodico': 'test_periodico',
            'url': 'https://test.com/article'
        }
        
        # No debería lanzar excepción
        self.modelo.enviar_a_api_noticias(noticia)
    
    def test_obtener_noticias_not_implemented(self):
        """Prueba que obtener_noticias lanza NotImplementedError"""
        with self.assertRaises(NotImplementedError):
            self.modelo.obtener_noticias()


class TestModeloPeriodicoAsync(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.modelo = ModeloPeriodico("https://test.com")
    
    async def test_obtener_noticias_async_not_implemented(self):
        """Prueba que obtener_noticias_async lanza NotImplementedError"""
        with self.assertRaises(NotImplementedError):
            await self.modelo.obtener_noticias_async()
    
    async def test_fetch_html_async_success(self):
        """Prueba que fetch_html_async funciona correctamente cuando la solicitud es exitosa"""
        # Crear un mock para la respuesta
        mock_response = AsyncMock()
        mock_response.status = 200
        mock_response.text = AsyncMock(return_value="<html><body>Test Async Content</body></html>")
        
        # Crear un mock para la sesión
        mock_session = AsyncMock()
        mock_session.get = AsyncMock()
        
        # Configurar el mock para que devuelva la respuesta correcta
        cm = AsyncMock()
        cm.__aenter__.return_value = mock_response
        mock_session.get.return_value = cm
        
        # Llamar al método bajo prueba
        result = await self.modelo.fetch_html_async(mock_session, "https://test.com/page")
        
        # Verificar los resultados
        self.assertIsNotNone(result)
        self.assertEqual(await result.text(), "<html><body>Test Async Content</body></html>")
        mock_session.get.assert_called_once_with("https://test.com/page", headers=self.modelo.headers)
    
    async def test_fetch_html_async_failure(self):
        """Prueba que fetch_html_async maneja correctamente los errores"""
        # Crear un mock para la sesión que lanza una excepción
        mock_session = AsyncMock()
        mock_session.get.side_effect = Exception("Error de conexión async")
        
        # Llamar al método bajo prueba
        result = await self.modelo.fetch_html_async(mock_session, "https://test.com/page")
        
        # Verificar que el resultado es None cuando hay un error
        self.assertIsNone(result)
    
    async def test_enviar_a_api_noticias_async(self):
        """Prueba que enviar_a_api_noticias_async envía correctamente los datos a la API"""
        # Crear mocks para las respuestas
        mock_get_response = AsyncMock()
        mock_get_response.status = 200
        
        mock_post_response = AsyncMock()
        mock_post_response.status = 200
        
        # Crear un mock para la sesión
        mock_session = AsyncMock()
        
        # Configurar los mocks para get y post
        get_cm = AsyncMock()
        get_cm.__aenter__.return_value = mock_get_response
        mock_session.get.return_value = get_cm
        
        post_cm = AsyncMock()
        post_cm.__aenter__.return_value = mock_post_response
        mock_session.post.return_value = post_cm
        
        # Datos de prueba
        noticia = {
            'titulo': 'Título de Prueba Async',
            'periodico': 'test_periodico',
            'url': 'https://test.com/article'
        }
        
        # Crear un mock para ClientSession que devuelve nuestra sesión mock
        with patch('aiohttp.ClientSession', return_value=mock_session):
            # Llamar al método bajo prueba
            await self.modelo.enviar_a_api_noticias_async(noticia)
            
            # Verificar que se llamaron los métodos correctos
            mock_session.get.assert_called_once()
            mock_session.post.assert_called_once()


if __name__ == '__main__':
    unittest.main()