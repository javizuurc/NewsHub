CREATE DATABASE IF NOT EXISTS NewsHub;
USE NewsHub;

CREATE TABLE IF NOT EXISTS periodicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS temas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS claves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    palabra VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    subtitulo TEXT,
    periodico_id INT,
    autor VARCHAR(255),
    articulo TEXT,
    url VARCHAR(255),
    fecha_publicacion DATETIME,
    fecha_scraping DATETIME,
    coeficiente VARCHAR(255),
    justificacion TEXT,
    temas VARCHAR(255),
    claves TEXT,
    FOREIGN KEY (periodico_id) REFERENCES periodicos(id)
);

CREATE TABLE IF NOT EXISTS noticia_temas (
    noticia_id INT,
    tema_id INT,
    PRIMARY KEY (noticia_id, tema_id),
    FOREIGN KEY (noticia_id) REFERENCES noticias(id),
    FOREIGN KEY (tema_id) REFERENCES temas(id)
);

CREATE TABLE IF NOT EXISTS noticia_claves (
    noticia_id INT,
    palabra_id INT,
    PRIMARY KEY (noticia_id, palabra_id),
    FOREIGN KEY (noticia_id) REFERENCES noticias(id),
    FOREIGN KEY (palabra_id) REFERENCES claves(id)
);

-- NUEVAS TABLAS

CREATE TABLE IF NOT EXISTS grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular_general TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupo_noticia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grupo_id INT NOT NULL,
    noticia_id INT NOT NULL,
    FOREIGN KEY (grupo_id) REFERENCES grupos(id),
    FOREIGN KEY (noticia_id) REFERENCES noticias(id)
);

-- DATOS INICIALES

INSERT INTO periodicos (nombre, url) 
VALUES 
    ('El pais', 'https://elpais.com'),
    ('El plural', 'https://www.elplural.com'),
    ('ABC', 'https://www.abc.es'),
    ('LibertadDigital', 'https://www.libertaddigital.com');

INSERT INTO temas (nombre) 
VALUES 
    ('Política y Gobierno'),
    ('Economía y Finanzas'),
    ('Sociedad y Cultura'),
    ('Tecnología e Innovación'),
    ('Salud y Ciencia'),
    ('Medio Ambiente y Cambio Climático'),
    ('Seguridad y Crimen'),
    ('Deportes'),
    ('Entretenimiento y Espectáculos'),
    ('Educación y Formación');