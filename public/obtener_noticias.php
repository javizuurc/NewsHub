<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');

    /* JAVI: Como dije en el Javascript, hacer una clase o algo para la conexion a la base de datos, para evitar que el public 
    tenga los datos de la conexión */
    try {
        if (file_exists(__DIR__ . '/../.env')) {
            $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                    list($key, $value) = explode('=', $line, 2);
                    $_ENV[trim($key)] = trim($value);
                }
            }
        }
        
        $servername = $_ENV['DB_HOST'] ?? 'localhost';
        $username = $_ENV['DB_USERNAME'] ?? 'javi';
        $password = $_ENV['DB_PASSWORD'] ?? 'contraseña';
        $dbname = $_ENV['DB_DATABASE'] ?? 'NewsHub';

        if (!extension_loaded('mysqli')) {
            if (extension_loaded('pdo_mysql')) {
                $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];
                
                $pdo = new PDO($dsn, $username, $password, $options);
                
                $sql = "SELECT 
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
                                MAX(n2.fecha_publicacion) AS max_fecha
                            FROM 
                                noticias n2
                            GROUP BY 
                                n2.periodico_id
                        ) sub ON sub.periodico_id = n.periodico_id 
                        AND n.fecha_publicacion = sub.max_fecha
                        ORDER BY 
                            n.fecha_publicacion DESC;";
                
                $stmt = $pdo->query($sql);
                $response = $stmt->fetchAll();
                
            } else {
                $response = [
                    [
                        'titulo' => 'El gobierno anuncia nuevas medidas económicas para impulsar el crecimiento',
                        'fecha_publicacion' => '2023-05-15',
                        'periodico_nombre' => 'El Diario',
                        'url' => 'https://example.com/noticia1',
                        'coeficiente' => 0.2
                    ],
                    [
                        'titulo' => 'Avances en la investigación de energías renovables prometen reducir emisiones de carbono',
                        'fecha_publicacion' => '2023-05-14',
                        'periodico_nombre' => 'Ciencia Hoy',
                        'url' => 'https://example.com/noticia2',
                        'coeficiente' => -0.1
                    ]
                ];
                
                error_log("No MySQL extensions available. Using mock data.");
            }
        } else {
            $conn = new mysqli($servername, $username, $password, $dbname);

            if ($conn->connect_error) {
                throw new Exception("Database connection failed: " . $conn->connect_error);
            }

            $sql = "SELECT 
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
                            MAX(n2.fecha_publicacion) AS max_fecha
                        FROM 
                            noticias n2
                        GROUP BY 
                            n2.periodico_id
                    ) sub ON sub.periodico_id = n.periodico_id 
                    AND n.fecha_publicacion = sub.max_fecha
                    ORDER BY 
                        n.fecha_publicacion DESC;";
                        
            $result = $conn->query($sql);

            $response = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $response[] = $row;
                }
            }
            
            $conn->close();
        }

        echo json_encode($response);
        
    } catch (Exception $e) {
        error_log("Error in obtener_noticias.php: " . $e->getMessage());
        echo json_encode(["error" => $e->getMessage()]);
    }
?>