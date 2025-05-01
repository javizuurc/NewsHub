const QUERIES = {
    ULTIMAS_NOTICIAS_PERIODICOS: `
        SELECT
            n.titulo,
            n.fecha_publicacion,
            p.nombre AS periodico_nombre,
            n.url,
            n.coeficiente
        FROM
            noticias n
        JOIN
            periodicos p ON p.id = n.periodico_id
        JOIN (
            SELECT
                n2.periodico_id,
                MAX(n2.id) AS max_id
            FROM
                noticias n2
            GROUP BY
                n2.periodico_id
        ) sub ON sub.periodico_id = n.periodico_id
        AND n.id = sub.max_id
        ORDER BY
            n.id DESC;

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
        SELECT id FROM periodicos
    `,
    MEDIA_CALIFICACION_NOTICIAS: `
    SELECT AVG(coeficiente) FROM noticias
    `
};

module.exports = QUERIES;