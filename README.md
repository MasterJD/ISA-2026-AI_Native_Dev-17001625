# TraveLens

Aplicacion de exploracion de destinos tipo Pinterest con Next.js App Router, BFF pattern y generacion de planes de viaje asistida por IA.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Base UI
- Lucide React
- Vitest + Testing Library

## Arquitectura

- `src/app/api/`: rutas BFF que encapsulan llamadas externas.
- `src/services/unsplash.ts`: logica de datos de destinos y mapeo.
- `src/services/gemini.ts`: generacion de planes estructurados.
- `src/components/ui/`: primitives UI.
- `src/components/features/`: componentes de negocio.
- `src/components/providers/`: estado global (favoritos).

## Funcionalidades Implementadas

- Busqueda en tiempo real con sincronizacion de query params (`?q=`).
- Grid masonry responsivo de destinos.
- Favoritos persistentes (localStorage) con filtro "Solo favoritos".
- Navegacion por teclado en grid:
	- Flechas para mover foco.
	- Tecla `F` para agregar/quitar favorito.
- Vista de detalle en `destination/[id]`:
	- Hero con titulo y tags.
	- Panel de plan IA.
	- Sidebar de destinos similares en formato mosaico.
- Manejo de errores visible en frontend (alertas y `app/error.tsx`).

## Variables de Entorno

Crear ` .env.local ` con:

```env
UNSPLASH_ACCESS_KEY=tu_clave_unsplash
GOOGLE_GENAI_API_KEY=tu_clave_gemini
```

Si faltan claves de Unsplash, la aplicacion usa datos mock para no bloquear la UI.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run test
```

## Testing

Se incluyen pruebas unitarias e integracion ligera para:

- Helpers de favoritos.
- Servicio de generacion de plan.
- Ruta BFF `POST /api/ai-plan`.

Archivos principales de test:

- `src/lib/favorites.test.ts`
- `src/services/gemini.test.ts`
- `src/app/api/ai-plan/route.test.ts`
