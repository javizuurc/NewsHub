import sys
import os
import pytest

# Aseguramos que el path base esté en sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from scripts.scrapers.periodicos.libertad_digital import LibertadDigital

@pytest.mark.asyncio
async def test_obtener_noticias_async_libertad_digital():
    scraper = LibertadDigital()
    noticias = await scraper.obtener_noticias_async()

    assert isinstance(noticias, list)
    if noticias:
        noticia = noticias[0]
        assert 'titulo' in noticia
        assert 'url' in noticia
        assert isinstance(noticia['titulo'], str)
        assert isinstance(noticia['url'], str)
