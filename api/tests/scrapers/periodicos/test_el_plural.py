import sys
import os
import pytest

# Agregamos el path del proyecto para importar correctamente
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from scripts.scrapers.periodicos.el_plural import ElPlural

@pytest.mark.asyncio
async def test_obtener_noticias_async_el_plural():
    scraper = ElPlural()
    noticias = await scraper.obtener_noticias_async()

    assert isinstance(noticias, list)
    if noticias:
        noticia = noticias[0]
        assert 'titulo' in noticia
        assert 'url' in noticia
        assert isinstance(noticia['titulo'], str)
        assert isinstance(noticia['url'], str)
