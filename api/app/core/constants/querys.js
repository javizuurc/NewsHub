const QUERIES = {
    ULTIMAS_NOTICIAS_PERIODICOS: `
      
      (
            SELECT
                n.id,
                n.titulo,
                DATE_FORMAT(n.fecha_publicacion, '%d-%m-%Y') AS fecha_publicacion,
                p.nombre AS periodico_nombre,
                n.url,
                n.coeficiente
            FROM noticias n
            JOIN periodicos p ON p.id = n.periodico_id
            INNER JOIN (
                SELECT periodico_id, MIN(id) AS min_id
                FROM noticias
                GROUP BY periodico_id
            ) sub ON sub.periodico_id = n.periodico_id AND n.id = sub.min_id
            )
            UNION
            (
            SELECT
                n.id,
                n.titulo,
                DATE_FORMAT(n.fecha_publicacion, '%d-%m-%Y') AS fecha_publicacion,
                p.nombre AS periodico_nombre,
                n.url,
                n.coeficiente
            FROM noticias n
            JOIN periodicos p ON p.id = n.periodico_id
            WHERE DATE(n.fecha_scraping) = CURDATE()
                AND n.id NOT IN (
                SELECT MIN(id)
                FROM noticias
                WHERE DATE(fecha_scraping) = CURDATE()
                GROUP BY periodico_id
                )
            ORDER BY RAND()
            LIMIT 1
            );
                


        `,
    TOPICOS_DIARIOS: `
        SELECT 
            c.nombre AS palabra, 
            COUNT(*) AS frecuencia
        FROM 
            noticias_claves nc
        JOIN 
            claves c ON nc.clave_id = c.id
        JOIN 
            noticias n ON nc.noticia_id = n.id
        WHERE 
            DATE(n.fecha_scraping) = (SELECT MAX(DATE(fecha_scraping)) FROM noticias)
        GROUP BY 
            c.nombre
        ORDER BY 
            frecuencia DESC
        LIMIT 6
    `,
    TOPICOS_SEMANALES: `
        SELECT 
            c.nombre AS palabra, 
            COUNT(*) AS frecuencia
        FROM 
            noticias_claves nc
        JOIN 
            claves c ON nc.clave_id = c.id
        JOIN 
            noticias n ON nc.noticia_id = n.id
        WHERE 
            n.fecha_scraping >= DATE_SUB((SELECT MAX(DATE(fecha_scraping)) FROM noticias), INTERVAL 7 DAY)
        GROUP BY 
            c.nombre
        ORDER BY 
            frecuencia DESC
        LIMIT 6
    `,
    CONTAR_NOTICIAS: `
        SELECT COUNT(id) FROM noticias
    `,
    CONTAR_PERIODICOS: `
        SELECT count(id) FROM periodicos
    `,
    DIAS_NOTICIAS: `
        SELECT COUNT(DISTINCT fecha_publicacion) AS dias_con_noticias
        FROM noticias;
    `,
    MEDIA_CALIFICACION_NOTICIAS: `
    SELECT AVG(coeficiente) FROM noticias
    `,
    GRUPOS_NOTICIAS:`
        WITH noticias_validas AS (
        SELECT *
        FROM noticias
        ),

        grupos_filtrados AS (
        SELECT
            g.id AS grupo_id,
            MAX(DATE(n.fecha_scraping)) AS fecha_mas_reciente,
            COUNT(*) AS cantidad_noticias
        FROM grupos g
        JOIN grupo_noticia gn ON g.id = gn.grupo_id
        JOIN noticias_validas n ON gn.noticia_id = n.id
        GROUP BY g.id
        HAVING COUNT(*) > 1
        ORDER BY fecha_mas_reciente DESC, cantidad_noticias DESC
        LIMIT 7
        ),

        imagen_valida_por_grupo AS (
        SELECT
            gn.grupo_id,
            MIN(n.imagen) AS imagen_valida
        FROM grupo_noticia gn
        JOIN noticias_validas n ON gn.noticia_id = n.id
        JOIN periodicos p ON n.periodico_id = p.id
        WHERE p.nombre != 'Libertad Digital'
            AND n.imagen NOT LIKE '%trans.png%'
        GROUP BY gn.grupo_id
        )

        SELECT
          g.id AS grupo_id,
          g.titular_general,
          n.id AS noticia_id,
          n.titulo AS noticia_titulo,
          COALESCE(iv.imagen_valida, 'http://www.newshub.com/img/generica.jpg') AS imagen,
          n.justificacion,
          n.url,
          n.fecha_publicacion,
          n.coeficiente,
          p.nombre AS periodico
        FROM grupos g
        JOIN grupo_noticia gn ON g.id = gn.grupo_id
        JOIN noticias_validas n ON gn.noticia_id = n.id
        JOIN periodicos p ON n.periodico_id = p.id
        LEFT JOIN imagen_valida_por_grupo iv ON iv.grupo_id = g.id
        WHERE g.id IN (SELECT grupo_id FROM grupos_filtrados)
        ORDER BY g.id, n.fecha_scraping DESC;
        `,
    FRECUENCIA_TOPICO: `
        SELECT 
            DATE(n.fecha_scraping) AS fecha, 
            COUNT(*) AS frecuencia
        FROM 
            noticias_claves nc
        JOIN 
            claves c ON nc.clave_id = c.id
        JOIN 
            noticias n ON nc.noticia_id = n.id
        WHERE 
            LOWER(TRIM(c.nombre)) = LOWER(TRIM(?))
        GROUP BY 
            fecha
        ORDER BY 
            fecha DESC
        LIMIT 7;
    `,
};

module.exports = QUERIES;