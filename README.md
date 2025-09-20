# Social API

API RESTful para una aplicación web que permite la creación de usuarios, publicación de mensajes cortos y seguimiento entre usuarios. Desarrollada con Express.js y PostgreSQL.

## Funcionalidades
- Crear e iniciar sesión de usuarios (email y contraseña).
- Obtener información de un usuario.
- Seguir o dejar de seguir a otros usuarios.
- Crear mensajes con fecha/hora.
- Listar los últimos 10 mensajes (configurable).
- Listar mensajes de un usuario específico.
- Ver feed de mensajes de usuarios seguidos.
- Buscar mensajes por coincidencia de texto.
- Eliminar usuario (con eliminación en cascada de mensajes).

## Requisitos
- Node.js 18+
- PostgreSQL
- Dependencias: Ver `package.json`

## Instalación
1. Clona el repositorio: `git clone https://github.com/tu-usuario/social-api.git`
2. Instala dependencias: `npm install`
3. Configura `.env` con: usuario y contraseña de la base de datos
4. Crea el esquema: `psql -d social_db -f sql/schema.sql`
5. Inicia la app: `npm start` o `npm run dev` (con nodemon para desarrollo)

## Uso
- La API corre en `http://localhost:3000`.
- Consulta la especificación OpenAPI en `src/openapi.yaml` (puedes visualizarla con Swagger UI).
- Ejemplo de creación de usuario:
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"secret"}'