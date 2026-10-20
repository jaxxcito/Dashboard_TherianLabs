# Servidor de prueba

Reemplazo temporal del microservicio Spring Boot, para que el panel y la app trabajen con los mismos datos.
No necesita instalar nada, solo Node.

## Cómo correrlo

```bash
node server.js
```

>> QUE HACE: levanta el servidor en el puerto 8080 y muestra en la consola las direcciones que debe usar la app.

Los datos viven en memoria: al reiniciar el servidor vuelven a los de ejemplo.

## Conectar el panel

En la carpeta del panel crea un archivo `.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8080
```

>> QUE HACE: le dice al panel que deje los datos de ejemplo del navegador y use este servidor. Después hay que reiniciar `npm run dev`.

## Conectar la app

- **Emulador:** no hay que cambiar nada, `BASE_URL` ya apunta a `http://10.0.2.2:8080/`.
- **Celular real:** cambiar `BASE_URL` en `Api.kt` por la dirección que muestra el servidor al iniciar (mismo wifi que el PC). Si Windows pregunta por el firewall, permitir Node.

## Qué endpoints tiene

Los mismos del README del panel, más `GET /api/eventos/{id}` y `POST /api/prospectos/lote`, que son los que usa la app.
Administradora de prueba: `admin@duoc.cl` / `admin123`.
