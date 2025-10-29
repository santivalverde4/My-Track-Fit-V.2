-- =====================================================
-- SISTEMA DE FITNESS - SCRIPT COMPLETO POSTGRESQL
-- =====================================================

-- =====================================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- =====================================================

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    confirmed BOOLEAN DEFAULT FALSE
);

-- Tabla de archivos de usuario con todas las extensiones
CREATE TABLE ArchivosUsuario (
    id SERIAL PRIMARY KEY,
    idcliente INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ArchivoBody JSONB,
    ArchivoRutina JSONB,
    ArchivoEjercicio JSONB,
    archivonutricion JSONB,
    archivolesiones JSONB,
    archivoestadisticas JSONB,
    archivoia JSONB
);

-- Tabla base de ejercicios disponibles
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de rutinas del usuario (contenedor principal)
CREATE TABLE rutinas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de entrenamientos (días específicos dentro de rutinas)
CREATE TABLE entrenamientos (
    id SERIAL PRIMARY KEY,
    rutina_id INTEGER REFERENCES rutinas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    dia_semana INTEGER CHECK (dia_semana BETWEEN 1 AND 7),
    orden INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de instancias de ejercicios en entrenamientos
CREATE TABLE exercise_instances (
    id SERIAL PRIMARY KEY,
    entrenamiento_id INTEGER REFERENCES entrenamientos(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    series INTEGER,
    repeticiones VARCHAR(50),
    peso DECIMAL(6,2),
    descanso INTEGER,
    notas TEXT,
    orden INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SISTEMA DE LESIONES
-- =====================================================


-- Tabla temporal para lesiones individuales
CREATE TABLE LesionesTemporales (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nombre_lesion VARCHAR(200) NOT NULL,
    parte_cuerpo VARCHAR(100),
    severidad VARCHAR(20) CHECK (severidad IN ('leve', 'moderada', 'severa')),
    fecha_lesion DATE NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'en_recuperacion', 'curada')),
    tiempo_estimado_recuperacion INTEGER,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SISTEMA DE NUTRICIÓN
-- =====================================================

-- Tabla de alimentos base
CREATE TABLE AlimentosBase (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    calorias_por_100g DECIMAL(8,2),
    proteinas_por_100g DECIMAL(8,2),
    carbohidratos_por_100g DECIMAL(8,2),
    grasas_por_100g DECIMAL(8,2),
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla temporal para registro diario de nutrición
CREATE TABLE NutricionTemporal (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    tipo_comida VARCHAR(20) CHECK (tipo_comida IN ('desayuno', 'almuerzo', 'cena', 'merienda')),
    alimento_id INTEGER REFERENCES AlimentosBase(id),
    nombre_alimento VARCHAR(200),
    cantidad_gramos DECIMAL(8,2),
    calorias DECIMAL(8,2),
    proteinas DECIMAL(8,2),
    carbohidratos DECIMAL(8,2),
    grasas DECIMAL(8,2),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para objetivos nutricionales del usuario
CREATE TABLE ObjetivosNutricionales (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    calorias_objetivo DECIMAL(8,2),
    proteinas_objetivo DECIMAL(8,2),
    carbohidratos_objetivo DECIMAL(8,2),
    grasas_objetivo DECIMAL(8,2),
    agua_objetivo INTEGER DEFAULT 8, -- vasos de agua
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SISTEMA DE MÉTRICAS Y ESTADÍSTICAS
-- =====================================================

-- Tabla para métricas diarias del usuario
CREATE TABLE MetricasDiarias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    peso DECIMAL(5,2),
    horas_sueno DECIMAL(4,2),
    nivel_energia INTEGER CHECK (nivel_energia BETWEEN 1 AND 10),
    nivel_estres INTEGER CHECK (nivel_estres BETWEEN 1 AND 10),
    estado_animo VARCHAR(20),
    vasos_agua INTEGER DEFAULT 0,
    calorias_consumidas DECIMAL(8,2),
    calorias_quemadas DECIMAL(8,2),
    pasos INTEGER,
    minutos_ejercicio INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, fecha)
);

-- =====================================================
-- SISTEMA DE INTELIGENCIA ARTIFICIAL 
-- =====================================================

-- Tabla para guardar conversaciones del Smart Trainer persistentemente
CREATE TABLE ConversacionesIA (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tipo_mensaje VARCHAR(10) CHECK (tipo_mensaje IN ('user', 'trainer')),
    contenido TEXT NOT NULL,
    timestamp_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- =====================================================

-- Índices para tablas principales
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_archivos_usuario_idcliente ON ArchivosUsuario(idcliente);
CREATE INDEX idx_exercises_categoria ON exercises(categoria);
CREATE INDEX idx_rutinas_usuario_id ON rutinas(usuario_id);
CREATE INDEX idx_rutinas_activa ON rutinas(activa);
CREATE INDEX idx_entrenamientos_rutina_id ON entrenamientos(rutina_id);
CREATE INDEX idx_entrenamientos_dia_semana ON entrenamientos(dia_semana);
CREATE INDEX idx_exercise_instances_entrenamiento_id ON exercise_instances(entrenamiento_id);
CREATE INDEX idx_exercise_instances_exercise_id ON exercise_instances(exercise_id);

-- Índices para sistema de lesiones
CREATE INDEX idx_lesiones_temporales_usuario_id ON LesionesTemporales(usuario_id);
CREATE INDEX idx_lesiones_temporales_fecha ON LesionesTemporales(fecha_lesion);
CREATE INDEX idx_lesiones_temporales_estado ON LesionesTemporales(estado);
CREATE INDEX idx_lesiones_temporales_severidad ON LesionesTemporales(severidad);

-- Índices para sistema de nutrición
CREATE INDEX idx_alimentos_base_categoria ON AlimentosBase(categoria);
CREATE INDEX idx_nutricion_temporal_usuario_id ON NutricionTemporal(usuario_id);
CREATE INDEX idx_nutricion_temporal_fecha ON NutricionTemporal(fecha);
CREATE INDEX idx_nutricion_temporal_tipo_comida ON NutricionTemporal(tipo_comida);
CREATE INDEX idx_objetivos_nutricionales_usuario_id ON ObjetivosNutricionales(usuario_id);

-- Índices para métricas
CREATE INDEX idx_metricas_diarias_usuario_id ON MetricasDiarias(usuario_id);
CREATE INDEX idx_metricas_diarias_fecha ON MetricasDiarias(fecha);
CREATE INDEX idx_metricas_diarias_usuario_fecha ON MetricasDiarias(usuario_id, fecha);

-- Índices para sistema de IA
CREATE INDEX idx_conversaciones_ia_usuario_id ON ConversacionesIA(usuario_id);
CREATE INDEX idx_conversaciones_ia_timestamp ON ConversacionesIA(timestamp_mensaje);

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE users IS 'Usuarios del sistema de fitness';
COMMENT ON TABLE ArchivosUsuario IS 'Archivos y datos completos del usuario en formato JSONB';
COMMENT ON TABLE exercises IS 'Catálogo base de ejercicios disponibles en el sistema';
COMMENT ON TABLE rutinas IS 'Rutinas de entrenamiento personalizadas del usuario';
COMMENT ON TABLE entrenamientos IS 'Días específicos de entrenamiento dentro de rutinas';
COMMENT ON TABLE exercise_instances IS 'Instancias de ejercicios con parámetros específicos en entrenamientos';

COMMENT ON TABLE LesionesTemporales IS 'Registro temporal de lesiones del usuario';

COMMENT ON TABLE AlimentosBase IS 'Base de datos de alimentos con información nutricional';
COMMENT ON TABLE NutricionTemporal IS 'Registro diario temporal de nutrición';
COMMENT ON TABLE ObjetivosNutricionales IS 'Objetivos nutricionales personalizados por usuario';

COMMENT ON TABLE MetricasDiarias IS 'Métricas diarias de salud y bienestar del usuario';

COMMENT ON TABLE ConversacionesIA IS 'Conversaciones persistentes del chat con Smart Trainer por usuario';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================