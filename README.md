# 🌆 LIMA CITY — Edición Perú

Juego web de compra de propiedades ambientado en distritos de Lima. Incluye tablero de 40 casillas, partidas privadas de 2 a 6 jugadores, dados, alquileres, casas/hoteles, hipotecas, impuestos, eventos y bancarrota.

## Publicación rápida en GitHub + Vercel

1. Descomprime el ZIP y sube **el contenido de la carpeta** a un repositorio nuevo de GitHub (Add file → Upload files → Commit changes).
2. En https://console.firebase.google.com crea un proyecto. En **Build → Realtime Database**, crea una base de datos y copia su URL. **Importante:** selecciona Realtime Database, no Firestore.
3. En **Realtime Database → Rules** pega el contenido de `database.rules.json` y publica las reglas. **Estas reglas son solo para pruebas privadas**: permiten leer y modificar salas sin autenticar. No son adecuadas para un lanzamiento público.
4. En Firebase → Configuración del proyecto → Tus apps → Web (`</>`) registra una app y copia los valores de `firebaseConfig`.
5. En https://vercel.com crea **Add New → Project**, importa el repositorio y elige Vite (o deja que lo detecte). En **Environment Variables** añade:
   - `VITE_FIREBASE_API_KEY` = `apiKey`
   - `VITE_FIREBASE_AUTH_DOMAIN` = `authDomain`
   - `VITE_FIREBASE_DATABASE_URL` = URL de Realtime Database
   - `VITE_FIREBASE_PROJECT_ID` = `projectId`
   - `VITE_FIREBASE_APP_ID` = `appId`
6. Haz clic en **Deploy**. Si añadiste variables después de publicar, haz **Redeploy**. Abre el enlace de Vercel en cada celular, crea sala y comparte el código de 6 caracteres.

## Prueba en tu computadora

`npm install` → copia `.env.example` como `.env` y rellena los valores → `npm run dev`.

## Reglas y limitaciones de esta primera versión

- Cada jugador empieza con S/ 1,500. Pasar por salida otorga S/ 200.
- Turnos secuenciales, dados de 2 a 12; sin tiradas extra por dobles.
- Compra de propiedades, transporte y servicios; alquiler automático.
- Casas (hasta 4) y hotel (5.º nivel) con costo del 50 % del precio del distrito. Sin requisito de monopolio de color.
- Hipoteca de propiedades sin construcciones al 50 % y rescate al 55 % del precio.
- Cartas de eventos aleatorios simplificados; comisaría con un turno perdido.
- La partida termina cuando solo queda un jugador solvente.
- No hay comercio entre jugadores, subastas, temporizador ni reconexión garantizada. La partida no se guarda para continuar otro día; las salas de Firebase pueden permanecer almacenadas hasta que se borren manualmente.
- El proyecto **no incluye autenticación ni seguridad contra trampas**. Las reglas abiertas se entregan exclusivamente para pruebas con amigos de confianza. No compartas públicamente una base de datos con estas reglas; para producción se requiere autenticación, validación de movimientos y restricciones de acceso.

LIMA CITY es un proyecto independiente, con nombres, diseño y tablero propios; no es un producto oficial de Monopoly.
