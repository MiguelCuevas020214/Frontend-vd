# Imágenes del proyecto

Arrastra aquí tus archivos de imagen. Angular copia todo lo que esté en `public/`
tal cual, así que NO hay que tocar configuraciones: la URL de cada imagen es
`/assets/...` más su ruta dentro de esta carpeta.

```
public/assets/
├── logo.svg              → /assets/logo.svg        (logo del header, footer, login y panel)
├── tours/                → /assets/tours/...       (fotos de los tours)
├── paquetes/             → /assets/paquetes/...    (fotos de los paquetes)
├── portada/              → /assets/portada/...     (foto de portada/hero del home)
└── equipo/               → /assets/equipo/...      (fotos del equipo en Nosotros)
```

## Reglas de nombres (importantes)

- Minúsculas, sin espacios, sin acentos ni la letra ñ.
- Usa guiones: `cusco-machu-picchu-1.jpg` (no `Cusco Machu Picchu 1.jpg`).
- Formatos: `.jpg`, `.png` o `.webp`. El formulario del panel admite máximo 5 MB por imagen.
- Recomendación de tamaño:
  - Portada/hero: 1920×1080 px o más.
  - Tarjetas de tours/paquetes: 1200×900 px.
  - Fotos de equipo: 600×600 px.
