# PREGUNTA 3 – PC3 JavaScript Avanzado

Prototipo con **mini backend (Node.js + Express)** que expone un JSON vía API REST y un **frontend en React** que lo consume con **búsqueda en tiempo real**.

## Estructura
```
backend/    API REST (Express)
  server.js   rutas /api/recursos
  data.json   datos que expone la API
frontend/   React + Vite
  src/App.jsx          UI, fetch y búsqueda
  src/useDebounce.js   hook para esperar a que el usuario termine de escribir
```

## Cómo ejecutarlo
Abre **dos terminales**.

```bash
#backend (http://localhost:3001)
cd backend
npm install
npm start

#frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/recursos` | Devuelve todos los recursos |
| GET | `/api/recursos?q=texto` | Filtra por título, categoría, nivel o descripción (ignora mayúsculas y tildes) |
| GET | `/api/recursos/:id` | Devuelve un recurso o 404 |

## Cómo funciona la búsqueda en tiempo real
1. `onChange` actualiza el estado `busqueda` en cada tecla.
2. `useDebounce` espera 300 ms sin escribir antes de actualizar `q`.
3. `useEffect` depende de `q` y hace `fetch('/api/recursos?q=...')`.
4. `AbortController` cancela la petición anterior para evitar resultados desordenados.
5. Vite redirige `/api` al backend (proxy), por eso no hay problemas de CORS en desarrollo.
