# 🚀 Guía de Configuración - My Track Fit Backend

## 1. Configurar Supabase

### Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Tu proyecto ya está creado: `https://tkfhefhwvagooiyznqph.supabase.co`

### Obtener las Credenciales
1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia:
   - **Project URL**: `https://tkfhefhwvagooiyznqph.supabase.co`
   - **anon/public key**: Esta es tu `SUPABASE_KEY`

### Ejecutar el Script SQL
1. En Supabase, ve a **SQL Editor**
2. Abre el archivo `app/server/scripts.sql`
3. Copia todo el contenido y pégalo en el editor SQL
4. Ejecuta el script para crear todas las tablas

## 2. Configurar Variables de Entorno

### Crear archivo `.env`
En la raíz del proyecto, crea un archivo `.env` con:

```env
# Supabase Configuration
SUPABASE_URL=https://tkfhefhwvagooiyznqph.supabase.co
SUPABASE_KEY=tu_supabase_anon_key_aqui

# JWT Configuration
JWT_SECRET=mi_super_secreto_jwt_key_2024
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

### Generar un JWT Secret Seguro
Puedes generar uno con Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 3. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `@supabase/supabase-js` - Cliente de Supabase
- `express` - Framework web
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Autenticación JWT
- `cors` - Manejo de CORS
- `dotenv` - Variables de entorno
- `nodemon` - Auto-restart en desarrollo
- `concurrently` - Ejecutar múltiples comandos

## 4. Ejecutar el Servidor

### Modo Desarrollo (recomendado)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

### Ejecutar Backend y Frontend juntos
```bash
npm run dev:both
```

## 5. Verificar que Funciona

### Test del Health Check
```bash
curl http://localhost:5000/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-27T..."
}
```

### Test de Registro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## 6. Configuración Adicional de Supabase (Opcional pero Recomendado)

### Habilitar Row Level Security (RLS)

Para mayor seguridad, habilita RLS en Supabase:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrenamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE LesionesTemporales ENABLE ROW LEVEL SECURITY;
ALTER TABLE NutricionTemporal ENABLE ROW LEVEL SECURITY;
ALTER TABLE ObjetivosNutricionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE MetricasDiarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ArchivosUsuario ENABLE ROW LEVEL SECURITY;

-- Ejemplo: Política para que usuarios solo vean sus propias rutinas
CREATE POLICY "Users can view their own routines"
  ON rutinas
  FOR SELECT
  USING (auth.uid()::int = usuario_id);

CREATE POLICY "Users can create their own routines"
  ON rutinas
  FOR INSERT
  WITH CHECK (auth.uid()::int = usuario_id);

-- Repetir para otras tablas...
```

**NOTA**: Con la implementación actual usando JWT en lugar de Supabase Auth, las políticas RLS no se aplicarán automáticamente. Puedes:
1. Mantener el enfoque actual (JWT + lógica en el backend)
2. Migrar a Supabase Auth para aprovechar RLS

## 7. Estructura de Respuestas

Todas las respuestas de la API siguen este formato:

### Éxito
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

## 8. Problemas Comunes

### Error: "Missing Supabase environment variables"
- Verifica que `.env` existe y tiene `SUPABASE_URL` y `SUPABASE_KEY`
- Reinicia el servidor después de modificar `.env`

### Error: "relation does not exist"
- Ejecuta el script SQL en Supabase para crear las tablas

### Error: "CORS policy"
- Verifica que `CLIENT_URL` en `.env` coincida con la URL de tu frontend
- Por defecto es `http://localhost:5173` (Vite)

### Error: "Token inválido"
- Verifica que `JWT_SECRET` esté configurado en `.env`
- El token expira según `JWT_EXPIRES_IN` (por defecto 7 días)

## 9. Próximos Pasos

1. ✅ Servidor configurado y funcionando
2. 🔄 Probar todos los endpoints con Postman/Thunder Client
3. 🔗 Conectar el frontend con el backend
4. 🎨 Ajustar las rutas según necesidades específicas
5. 🔒 Implementar validaciones adicionales
6. 📊 Agregar más lógica de negocio según requerimientos

## 10. Tips de Desarrollo

- Usa **Thunder Client** o **Postman** en VS Code para probar la API
- Revisa los logs en la terminal donde corre el servidor
- Los cambios se recargan automáticamente con nodemon
- La estructura está diseñada para ser escalable y mantenible

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/es/guide/routing.html)
- [JWT.io](https://jwt.io/) - Para debuggear tokens
- [Postman](https://www.postman.com/) - Para probar la API
