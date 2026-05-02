-- 1. Tabla de Estadísticas Globales (ya debería existir, pero por si acaso)
CREATE TABLE IF NOT EXISTS estadisticas_globales (
    id SERIAL PRIMARY KEY,
    total_goles INTEGER DEFAULT 0,
    meta_goles INTEGER DEFAULT 1000,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Noticias (IA)
CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titular TEXT,
    contenido TEXT,
    imagen_url TEXT,
    fuente TEXT,
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Goles Históricos
CREATE TABLE IF NOT EXISTS goles_historicos (
    id SERIAL PRIMARY KEY,
    numero_gol INTEGER UNIQUE,
    fecha DATE,
    rival TEXT,
    competicion TEXT,
    equipo TEXT,
    minuto INTEGER,
    tipo_gol TEXT,
    es_hito BOOLEAN DEFAULT FALSE,
    descripcion TEXT
);

-- 4. Vistas Públicas para saltar restricciones de RLS (Opcional pero recomendado para Base44)
CREATE OR REPLACE VIEW v_stats_public AS 
SELECT total_goles, meta_goles, ultima_actualizacion 
FROM estadisticas_globales 
WHERE id = 1;

CREATE OR REPLACE VIEW v_historial_public AS 
SELECT numero_gol, fecha, rival, competicion, equipo, minuto, tipo_gol, es_hito, descripcion
FROM goles_historicos 
ORDER BY numero_gol DESC;

-- 5. Insertar datos iniciales si la tabla está vacía
INSERT INTO estadisticas_globales (id, total_goles, meta_goles)
VALUES (1, 970, 1000)
ON CONFLICT (id) DO UPDATE SET total_goles = EXCLUDED.total_goles;

-- Goles Históricos (Hitos)
INSERT INTO goles_historicos (numero_gol, fecha, rival, competicion, equipo, minuto, tipo_gol, es_hito, descripcion)
VALUES 
(900, '2024-09-05', 'Croacia', 'Nations League', 'Portugal', 34, 'Derecha', true, 'El primer jugador en llegar a 900 goles oficiales.'),
(950, '2025-12-10', 'Al Ahli', 'Saudi Pro League', 'Al-Nassr', 75, 'Cabeza', true, 'Hito alcanzado en la liga saudí.'),
(970, '2026-04-29', 'Al Ahli', 'Saudi Pro League', 'Al-Nassr', 82, 'Derecha', true, 'Último gran hito antes de los 1000.')
ON CONFLICT (numero_gol) DO NOTHING;
