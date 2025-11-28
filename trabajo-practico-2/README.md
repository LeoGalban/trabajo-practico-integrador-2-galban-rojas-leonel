
# Trabajo Práctico Integrador II – Blog con MongoDB

Autor: **Leonel Galban**  
Tecnología principal: **Node.js + Express + MongoDB (Mongoose)**

Este proyecto implementa un sistema de gestión de blog personal con:

- Autenticación con JWT y cookies httpOnly
- Encriptación de contraseñas con bcrypt
- Modelos y relaciones:
  - Usuario con perfil embebido
  - Artículos (Article) con autor y etiquetas
  - Comentarios referenciados a artículos y usuarios
  - Etiquetas (Tag) con relación N:M con artículos
- Eliminación lógica (soft delete) de usuarios
- Eliminación en cascada de comentarios al borrar artículos
- Remoción de etiquetas en cascada desde artículos
- Middlewares de:
  - Autenticación (`authMiddleware`)
  - Autorización de admin (`adminMiddleware`)
  - Dueño o admin (`ownerOrAdminMiddleware`)
  - Validaciones (`validatorMiddleware`)
- Validaciones con `express-validator`

## Requisitos

- Node.js 18+
- MongoDB en ejecución (local o remoto)

## Instalación

```bash
npm install
cp .env.example .env   # En Windows podés crear el .env a mano
```

Editar el archivo `.env` con la URI de tu base de datos y el secreto JWT.

## Ejecutar el servidor

```bash
npm run dev
```

El servidor se levanta por defecto en:

- API: `http://localhost:3000`

## Endpoints principales

### Autenticación – `/api/auth`

- `POST /api/auth/register` – Registra usuario y devuelve cookie de sesión
- `POST /api/auth/login` – Login por username o email + password
- `GET /api/auth/profile` – Devuelve el perfil del usuario autenticado
- `PUT /api/auth/profile` – Actualiza los datos del perfil embebido
- `POST /api/auth/logout` – Cierra sesión (borra cookie)

### Usuarios – `/api/users` (solo admin)

- `GET /api/users` – Lista usuarios con sus artículos y comentarios
- `GET /api/users/:id` – Usuario por id con artículos y comentarios
- `PUT /api/users/:id` – Modifica rol / username / email
- `DELETE /api/users/:id` – Elimina físicamente un usuario

### Etiquetas – `/api/tags`

- `POST /api/tags` – Crea etiqueta (solo admin)
- `GET /api/tags` – Lista todas las etiquetas
- `GET /api/tags/:id` – Devuelve etiqueta + artículos asociados
- `PUT /api/tags/:id` – Actualiza etiqueta (solo admin)
- `DELETE /api/tags/:id` – Borra etiqueta y la remueve de los artículos

### Artículos – `/api/articles`

- `POST /api/articles` – Crea artículo (auth)
- `GET /api/articles` – Lista artículos publicados
- `GET /api/articles/:id` – Devuelve artículo, autor, tags y comentarios
- `GET /api/articles/my` – Devuelve artículos del usuario autenticado
- `PUT /api/articles/:id` – Actualiza artículo (dueño o admin)
- `DELETE /api/articles/:id` – Elimina artículo + comentarios asociados
- `POST /api/articles/:articleId/tags/:tagId` – Agrega tag al artículo (dueño o admin)
- `DELETE /api/articles/:articleId/tags/:tagId` – Remueve tag del artículo (dueño o admin)

### Comentarios – `/api/comments`

- `POST /api/comments` – Crea comentario en un artículo
- `GET /api/comments/article/:articleId` – Lista comentarios por artículo
- `GET /api/comments/my` – Lista comentarios del usuario autenticado
- `PUT /api/comments/:id` – Actualiza comentario (dueño o admin)
- `DELETE /api/comments/:id` – Borra comentario (dueño o admin)

## Colección de Postman

En el archivo `postman_collection.json` se incluye una colección con ejemplos de request para probar todos los endpoints.

## Notas sobre el diseño de datos

- **Usuario**: tiene un perfil embebido (`profile`) con datos personales. Esto facilita obtener la información básica sin joins.
- **Artículo**: referencia al `author` (User) y mantiene un arreglo de `tags` (N:M).
- **Comentario**: referencia a `author` (User) y `article` (Article), lo que permite:
  - ver todos los comentarios de un artículo
  - ver todos los comentarios de un usuario
- **Eliminación en cascada**:
  - Al eliminar un `Article`, se borran todos los `Comment` que lo referencian.
  - Al eliminar un `Tag`, se quita de los arrays `tags` de los artículos.

Este proyecto está pensado para cumplir con los requisitos del Trabajo Práctico Integrador II.
