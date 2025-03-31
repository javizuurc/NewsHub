import unittest
from unittest.mock import patch, AsyncMock
import sys
import os
import asyncio

# Añadir el directorio api al path de Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import scrape_newspaper, main, PERIODICOS

class TestMain(unittest.IsolatedAsyncioTestCase):
    @patch('main.scrape_newspaper')
    async def test_main(self, mock_scrape):
        """Prueba que la función main llama a scrape_newspaper para cada periódico"""
        # Configurar el mock para que devuelva una tarea completada
        future = asyncio.Future()
        future.set_result(None)
        mock_scrape.return_value = future
        
        await main()
        
        # Verificar que scrape_newspaper fue llamado para cada periódico
        self.assertEqual(mock_scrape.call_count, len(PERIODICOS))
        
        # Verificar que se llamó con los argumentos correctos
        for i, (nombre, objeto) in enumerate(PERIODICOS.items()):
            args, kwargs = mock_scrape.call_args_list[i]
            self.assertEqual(args[0], nombre)
            self.assertEqual(args[1], objeto)
    
    @patch('periodicos.ABC.guardar_noticias_async')
    async def test_scrape_newspaper(self, mock_guardar):
        """Prueba que scrape_newspaper llama al método guardar_noticias_async del periódico"""
        # Configurar el mock para que no haga nada
        mock_guardar.return_value = None
        
        # Llamar a la función con un periódico de prueba
        periodico = PERIODICOS['abc']
        await scrape_newspaper('abc', periodico)
        
        # Verificar que se llamó al método guardar_noticias_async con el nombre correcto
        mock_guardar.assert_called_once_with('abc')


if __name__ == '__main__':
    unittest.main()