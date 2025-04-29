
#pipx inject pytest pytest-asyncio

import sys
import os
import pytest
import asyncio

# Agregar raíz del proyecto al sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from scripts.scrapers.periodicos.abc import ABC

@pytest.mark.asyncio
async def test_obtener_noticias_async_retorna_lista():
    scraper = ABC()
    noticias = await scraper.obtener_noticias_async()

    assert isinstance(noticias, list)
    if noticias:
        noticia = noticias[0]
        assert 'titulo' in noticia
        assert 'url' in noticia
        assert isinstance(noticia['titulo'], str)
        assert isinstance(noticia['url'], str)
