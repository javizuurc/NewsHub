<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');


    /* JAVI: Como dije en el Javascript, hacer una clase o algo para la conexion a la base de datos, para evitar que el public 
    tenga los datos de la conexión */

    $servername = "localhost";
    $username = "javi";
    $password = "contraseña";
    $dbname = "NewsHub";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
    }

    $sql = "WITH ultimos_registros AS (
                SELECT palabras_claves
                FROM noticias
                WHERE DATE(fecha_scraping) = (SELECT MAX(DATE(fecha_scraping)) FROM noticias)
            )
                    SELECT palabra, COUNT(*) AS frecuencia
                    FROM (
                        SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(palabras_claves, ',', n.n), ',', -1)) AS palabra
                        FROM ultimos_registros
                        JOIN (
                            SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 
                            UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
                        ) n ON CHAR_LENGTH(palabras_claves) - CHAR_LENGTH(REPLACE(palabras_claves, ',', '')) >= n.n - 1
                    ) palabras
                    WHERE palabra <> ''
                    GROUP BY palabra
                    ORDER BY frecuencia DESC
                    LIMIT 6;"
;
    $result = $conn->query($sql);

    $response = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
    } else {
        $response = ["error" => "0 resultados"];
    }

    echo json_encode($response);
    $conn->close();
?>
