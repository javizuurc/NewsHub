# sudo apt install pipx
# pipx ensurepath
# pipx install pytest
# instalar todas las librerias que hacen falta..  beautifullsoup4:
# pipx inject pytest requests
# pipx inject pytest aiohttp
# pipx inject pytest beautifulsoup4
#echo 'export PATH=$PATH:$HOME/.local/bin' >> ~/.bashrc
#source ~/.bashrc
# npm run test 


import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from scripts.scrapers.periodicos.el_pais import ElPais

def test_obtener_noticias_retorna_lista():
    scraper = ElPais()
    noticias = scraper.obtener_noticias()
    
    assert isinstance(noticias, list)
    if noticias:
        noticia = noticias[0]
        assert 'titulo' in noticia
        assert 'url' in noticia
