import aiohttp
import asyncio
import requests
import traceback
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from scripts.scrapers.periodicos.abc import ABC
from scripts.scrapers.periodicos.el_pais import ElPais
from scripts.scrapers.periodicos.el_plural import ElPlural
from scripts.scrapers.periodicos.libertad_digital import LibertadDigital

PERIODICOS = {
    'El País':          ElPais(), 
    #'el_diario':        ElDiario(),
    'El Plural':        ElPlural(),
    'ABC':              ABC(),
    #'la_vanguardia':    LaVanguardia(),
    'Libertad Digital': LibertadDigital()
}

async def scrape_newspaper(nombre, objeto):
    print(f"Iniciando scraping de {nombre}...")
    try:
        noticias_guardadas = await objeto.guardar_noticias_async(nombre)
        print(f"Completado scraping de {nombre}")
        return nombre, noticias_guardadas
    except aiohttp.ClientResponseError as e:
        print(f"Error HTTP {e.status} al hacer scraping de {nombre}: {e.message}")
        return nombre, 0
    except aiohttp.ClientError as e:
        print(f"Error de conexión al hacer scraping de {nombre}: {str(e)}")
        return nombre, 0
    except Exception as e:
        print(f"Error inesperado al hacer scraping de {nombre}: {str(e)}")
        print(f"Detalles del error: {traceback.format_exc()}")
        return nombre, 0

async def main():
    tareas = []
    for nombre, objeto in PERIODICOS.items():
        tareas.append(scrape_newspaper(nombre, objeto))
    
    await asyncio.gather(*tareas)
    
    try: # Obtener el número total de noticias desde Express.js
        # This endpoint might not exist anymore or might be causing an error
        # Let's try to read the JSON file directly instead
        import json
        import os
        
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'noticias.json')
        
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                noticias = json.load(f)
                total_noticias = len(noticias)
                print(f"\n--- RESUMEN DEL SCRAPING ---")
                print(f"Total de noticias en JSON: {total_noticias}")
        else:
            print(f"\nNo se encontró el archivo de noticias JSON")
    except Exception as e:
        print(f"\nError al leer el archivo JSON de noticias: {str(e)}")
    
    print("Scraping de todos los periódicos completado")

if __name__ == "__main__":
    asyncio.run(main())