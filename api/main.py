import aiohttp
import asyncio
import requests
import traceback
from periodicos import ABC, ElPais, ElPlural, LibertadDigital

PERIODICOS = {
    'el_pais':          ElPais(), 
    #'el_diario':        ElDiario(),
    'el_plural':        ElPlural(),
    'abc':              ABC(),
    #'la_vanguardia':    LaVanguardia(),
    'libertad_digital': LibertadDigital()
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
        response = requests.get("http://localhost:3000/noticias/count")
        if response.status_code == 200:
            total_noticias = response.json().get('count', 0)
            print(f"\n--- RESUMEN DEL SCRAPING ---")
            print(f"Total de noticias en express: {total_noticias}")
        else:
            print(f"\nError al obtener el conteo de noticias: {response.status_code}")
    except Exception as e:
        print(f"\nError al conectar con el servidor Express: {str(e)}")
    
    print("Scraping de todos los periódicos completado")

if __name__ == "__main__":
    asyncio.run(main())