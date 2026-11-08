# LIMA CITY v17 — Lima Moderna Urbana 🏙️🎲

Actualización sobre **LIMA CITY v16.2**. Juego de mesa web multijugador con Firebase Realtime Database y autenticación anónima.

## Qué cambia en v17

- **64 cartas en total**: 32 de Suerte Limeña y 32 de Arca Comunal, con nuevos eventos limeños y sin repetir cartas hasta agotar el mazo.
- Nuevos efectos: avanzar al siguiente transporte o servicio, pagar reparaciones por casas y hoteles, cobrar/pagar a los rivales y obtener un **pase para salir gratis de la comisaría**. El pase se guarda en el jugador y se puede usar antes de lanzar los dados.
- **Ocho grupos de color diferentes**. Al tocar una casilla aparece su grupo, las propiedades que lo componen y cuáles posees. La marca de cada jugador conserva su **color de propietario independiente**.
- Estilo **Lima moderna urbana**: fondo con identidad de ciudad, rótulos renovados, tablero con profundidad, casillas elevadas, dados y tarjetas mejoradas.
- **Dos modos de tablero en un mismo juego**: `Vista 2.5D` o `Vista plana`. Cada jugador puede cambiar de vista sin afectar la sala.
- Botón `📚 64 cartas` durante la partida para consultar el catálogo completo.
- Se mantienen **subastas dinámicas (+10/+20/+40)**, negociaciones con tarjetas, casas, hoteles, pozo, selección de ficha, reacciones y las opciones de temas noche/clásico/neón.
- Se conserva la interfaz horizontal adaptada a teléfono. Para usarla, gira el teléfono.

## Cómo instalar en GitHub / Vercel

1. Descomprime el ZIP.
2. Sube **todos los archivos de la raíz** al repositorio GitHub actual, reemplazando los anteriores.
3. Confirma los cambios (Commit changes).
4. Espera a que el despliegue en Vercel aparezca como **Ready**.
5. Abre el juego y crea una **sala nueva**, para que los mazos y jugadores tengan el estado actualizado.

**No cambies las variables de entorno ni las reglas de Firebase**: los archivos `firebase.js`, `database.rules.json` y `env.example` se conservaron desde v16.2.

## Verificación local

- `node --check engine.js`
- `npm test` (test automatizado del motor, sin instalar dependencias)
- `npm install` y `npm run build` para verificar la compilación completa en un equipo con acceso a npm.

Las pruebas automatizadas del motor comprobaron: las 64 cartas, ocho colores de grupo, reparaciones, pase de comisaría, compatibilidad con salas antiguas y subastas con contraofertas.

**Limitación de verificación**: JSX se analizó y transpiló sin errores usando TypeScript, pero no se pudo completar una compilación Vite en este entorno porque npm no terminó de instalar las dependencias; tampoco se probó la sincronización con dispositivos reales.

## Diseño

El aspecto 2.5D se logra con CSS, no con motor 3D/WebGL. Esto ayuda a mantener el rendimiento en teléfonos y evita alterar Firebase. La vista plana está disponible para pantallas pequeñas o usuarios que prioricen legibilidad.

© LIMA CITY — proyecto original inspirado en juegos de compra de propiedades.
