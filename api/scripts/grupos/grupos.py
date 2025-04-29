import sqlite3
import os
import sys
from dotenv import load_dotenv
from difflib import SequenceMatcher
from collections import defaultdict

def get_db_connection():
    """Establish connection to the database using credentials from .env"""
    # Load environment variables from .env file in project root
    env_path = "/home/manu/Escritorio/notic.ia/.env"
    if not os.path.exists(env_path):
        print(f"Error: .env file not found at {env_path}")
        sys.exit(1)
    
    load_dotenv(env_path)
    
    # Get database connection details from environment variables
    db_host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_path = os.getenv("DB_PATH")
    
    # If DB_PATH is provided, use SQLite
    if db_path:
        try:
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            print(f"Error connecting to SQLite database: {e}")
            sys.exit(1)
    # Otherwise, try to connect to MySQL/PostgreSQL
    elif db_host and db_name and db_user:
        try:
            # Check if it's MySQL or PostgreSQL based on environment variable
            db_type = os.getenv("DB_TYPE", "mysql").lower()
            
            if db_type == "mysql":
                import mysql.connector
                conn = mysql.connector.connect(
                    host=db_host,
                    database=db_name,
                    user=db_user,
                    password=db_password
                )
                return conn
            elif db_type == "postgresql":
                # Use psycopg2-binary instead of psycopg2
                import psycopg2
                conn = psycopg2.connect(
                    host=db_host,
                    database=db_name,
                    user=db_user,
                    password=db_password
                )
                return conn
            else:
                print(f"Unsupported database type: {db_type}")
                sys.exit(1)
        except ImportError as e:
            print(f"Error importing database module: {e}")
            print("Try installing the required packages:")
            print("  pip install mysql-connector-python  # For MySQL")
            print("  pip install psycopg2-binary  # For PostgreSQL (recommended)")
            sys.exit(1)
        except Exception as e:
            print(f"Error connecting to database: {e}")
            sys.exit(1)
    else:
        print("Error: Database connection details not found in .env file")
        sys.exit(1)

def get_noticias_with_keywords(conn):
    """Retrieve news IDs with their keyword IDs from the database"""
    try:
        cursor = conn.cursor()
        
        # Dictionary to store news IDs and their associated keyword IDs
        noticias_dict = defaultdict(list)
        
        if isinstance(conn, sqlite3.Connection):
            # Get all noticia_id and clave_id pairs from noticias_claves
            cursor.execute("SELECT noticia_id, clave_id FROM noticias_claves")
            for row in cursor.fetchall():
                noticia_id = row['noticia_id']
                clave_id = row['clave_id']
                noticias_dict[noticia_id].append(clave_id)
                
            # Now get titles for these noticia_ids
            noticias = []
            for noticia_id, keywords in noticias_dict.items():
                cursor.execute("SELECT titulo FROM noticias WHERE id = ?", (noticia_id,))
                result = cursor.fetchone()
                titulo = result['titulo'] if result else f"Noticia {noticia_id}"
                
                noticias.append({
                    'id': noticia_id,
                    'titulo': titulo,
                    'keywords': keywords
                })
        else:
            # For MySQL/PostgreSQL
            cursor.execute("SELECT noticia_id, clave_id FROM noticias_claves")
            for row in cursor.fetchall():
                noticia_id = row[0]
                clave_id = row[1]
                noticias_dict[noticia_id].append(clave_id)
                
            # Now get titles for these noticia_ids
            noticias = []
            for noticia_id, keywords in noticias_dict.items():
                cursor.execute("SELECT titulo FROM noticias WHERE id = %s", (noticia_id,))
                result = cursor.fetchone()
                titulo = result[0] if result else f"Noticia {noticia_id}"
                
                noticias.append({
                    'id': noticia_id,
                    'titulo': titulo,
                    'keywords': keywords
                })
        
        return noticias
    except Exception as e:
        print(f"Error retrieving noticias with keywords: {e}")
        return []

def jaccard_similarity(set1, set2):
    """Calculate Jaccard similarity between two sets"""
    return len(set1 & set2) / len(set1 | set2) if set1 | set2 else 0

def title_similarity(title1, title2):
    """Calculate similarity between two titles"""
    return SequenceMatcher(None, title1.lower(), title2.lower()).ratio()

def titular_representativo(titulos):
    """Find the most representative title from a list of titles"""
    puntajes = []
    for t1 in titulos:
        score = sum(title_similarity(t1, t2) for t2 in titulos if t2 != t1)
        puntajes.append((score, t1))
    puntajes.sort(reverse=True)
    return puntajes[0][1] if puntajes else titulos[0]

def agrupar_noticias_similares(noticias, threshold_keywords=0.3, threshold_titles=0.5):
    """Group similar news based on keyword IDs and title similarity"""
    n = len(noticias)
    visitados = [False] * n
    grupos = []

    for i in range(n):
        if visitados[i]:
            continue
        grupo_actual = [noticias[i]]
        visitados[i] = True

        for j in range(i + 1, n):
            if visitados[j]:
                continue
            
            # Handle cases where keywords might be None or empty
            keywords_i = set(noticias[i]['keywords']) if noticias[i]['keywords'] else set()
            keywords_j = set(noticias[j]['keywords']) if noticias[j]['keywords'] else set()
            
            # Calculate Jaccard similarity based on keyword IDs
            kw_sim = jaccard_similarity(keywords_i, keywords_j)
            
            # Get title fields, handling different possible field names
            title_i = noticias[i].get('titulo', noticias[i].get('title', ''))
            title_j = noticias[j].get('titulo', noticias[j].get('title', ''))
            
            title_sim = title_similarity(title_i, title_j)

            # Check if they share enough keywords and have similar titles
            if kw_sim > threshold_keywords and title_sim > threshold_titles:
                grupo_actual.append(noticias[j])
                visitados[j] = True

        # Only add groups with more than one news article
        if len(grupo_actual) > 1:
            # Get title field for each news in the group
            titulos = [n.get('titulo', n.get('title', '')) for n in grupo_actual]
            
            grupo_info = {
                "titular_general": titular_representativo(titulos),
                "noticias": [{"id": n.get('id', 'N/A'), 
                              "titulo": n.get('titulo', n.get('title', 'N/A'))} 
                             for n in grupo_actual]
            }
            grupos.append(grupo_info)

    return grupos

def main():
    # Connect to the database using .env credentials
    conn = get_db_connection()
    
    # Get news with their keywords
    noticias = get_noticias_with_keywords(conn)
    
    if not noticias:
        print("No noticias found in the database.")
        if isinstance(conn, sqlite3.Connection):
            conn.close()
        else:
            conn.close()
        return
    
    print(f"Found {len(noticias)} noticias.")
    
    # Group similar news
    grupos = agrupar_noticias_similares(noticias)
    
    # Display the results
    if grupos:
        print(f"\nAgrupadas en {len(grupos)} grupos:")
        for i, grupo in enumerate(grupos, 1):
            print(f"\n=== GRUPO {i} ===")
            print(f"Titular representativo: {grupo['titular_general']}")
            print(f"Noticias en este grupo ({len(grupo['noticias'])}):")
            for j, noticia in enumerate(grupo['noticias'], 1):
                print(f"  {j}. ID: {noticia['id']} - {noticia['titulo']}")
    else:
        print("\nNo se encontraron grupos de noticias similares.")
        print("Prueba a ajustar los umbrales de similitud para obtener más grupos.")
    
    # Close the connection
    if isinstance(conn, sqlite3.Connection):
        conn.close()
    else:
        conn.close()

if __name__ == "__main__":
    main()