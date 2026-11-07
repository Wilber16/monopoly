# LIMA CITY v2 — Salas multijugador

## Publicar
1. Sustituye en GitHub los archivos del repositorio por los archivos **dentro** de esta carpeta (no subas la carpeta contenedora).
2. Vercel compilará automáticamente el nuevo commit. Conserva las cinco variables `VITE_FIREBASE_*` configuradas.
3. Firebase Console → Authentication → Sign-in method → Anonymous → Enable → Save.
4. Firebase Console → Realtime Database → Rules: reemplaza el contenido con `database.rules.json` y pulsa Publish.
5. Abre la URL de Vercel en dos navegadores o teléfonos diferentes. Crea una sala en uno, escribe el código en el otro, y comienza con 2 jugadores.

## Seguridad y limitaciones
Esta versión es **para pruebas privadas con amigos**, no para publicar abiertamente. Las reglas limitan las lecturas de partidas iniciadas a miembros autenticados, pero durante la fase lobby permiten lecturas y escrituras para que entren nuevos jugadores y las acciones de juego todavía se calculan en el navegador. Por tanto, **no es a prueba de trampas ni de abuso**. Para producción hay que mover las acciones a un backend confiable y validar cada transición; no uses dinero real ni datos personales. Los códigos de sala no son secretos robustos. Las partidas no se guardan para retomarlas otro día.

## Si aparece Permission denied
Confirma que activaste Authentication → Anonymous y publicaste las reglas del archivo. Verifica que la base de datos corresponde al mismo proyecto que tus variables de Vercel.
