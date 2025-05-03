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
        periodico_id,
        MAX(fecha_publicacion) AS max_fecha
    FROM
        noticias
    GROUP BY
        periodico_id
) sub ON sub.periodico_id = n.periodico_id
AND n.fecha_publicacion = sub.max_fecha
JOIN (
    SELECT
        periodico_id,
        MAX(id) AS max_id
    FROM
        noticias
    GROUP BY
        periodico_id
) sub2 ON sub2.periodico_id = n.periodico_id
AND n.id = sub2.max_id
ORDER BY
    n.fecha_publicacion DESC;



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
            DATE(n.fecha_publicacion) = (SELECT MAX(DATE(fecha_publicacion)) FROM noticias)
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
            n.fecha_publicacion >= DATE_SUB((SELECT MAX(DATE(fecha_publicacion)) FROM noticias), INTERVAL 7 DAY)
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