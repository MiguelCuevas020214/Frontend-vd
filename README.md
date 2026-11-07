# ViajeDirecto · Frontend

Plataforma responsive para una agencia de viajes, construida con Angular standalone, TypeScript estricto, Signals y Tailwind CSS v4.

## Ejecutar

```bash
npm install
npm start
```

Abre `http://localhost:4200`.

## Acceso de demostración

- **Dueño:** `owner@viajedirecto.com` / `Admin123*`
- **Editor:** `editor@viajedirecto.com` / `Editor123*`

La aplicación incluye un adaptador local (`environment.useMockApi: true`) para probar el frontend sin backend. Los cambios se guardan en `localStorage`. Para conectar una API real, cambia `useMockApi` a `false` y configura `apiUrl` en `src/environments/environment.ts`.

## Comandos

```bash
npm run build   # compilación de producción
npm test        # pruebas unitarias
npx prettier --write src
```

## Arquitectura

- `Core`: guards, interceptor, interfaces, servicios y utilidades.
- `Layouts`: chrome del sitio público, autenticación y panel privado.
- `Pages`: páginas con sus vistas públicas y de administración.
- `Shared/Components`: componentes base reutilizables y modales por entidad.
- `Shared/Global`: toast global e imágenes compartidas.

El panel tiene roles `owner` y `editor`; solo el dueño puede acceder a Usuarios. Todas las operaciones CRUD incluyen confirmación de eliminación, estados de carga y notificaciones.
