---
name: hola
description: Recuperar el contexto de la ultima tarea en este proyecto y continuar de donde se quedo. Busca la ultima sesion del repo y resume lo pendiente.
---

# Hola — continuar donde se quedó

Una skill para cuando se abre una nueva sessión y se necesita recordar de dónde
partir, sin tener que explicarlo otra vez.

## Cuándo disparar esta skill

- Al iniciar una nueva sessión en el repo.
- Cuando el owner diga "seguir con lo de antes", "continuar", o simplemente
  "hola".
- Cuando el contexto de la sessión actual esté vacío o no tenga nada que ver con
  el proyecto.

No hace falta para una sessión que ya tiene contexto claro.

## Procedimiento

1. **Identificar el repo.** La skill se carga desde `.kilo/skills/`, así que la
   sessión debe estar en la carpeta del repo. Si no lo está, decirlo y pedir que
   cambie de carpeta.

2. **Recuperar la última tarea.** Usar la herramienta `kilo_local_recall` con
   `mode: "search"` y un query que combine términos del proyecto: nombre del
   repo, "carrito", "entrega", "dirección", "desplegar", "commit".

3. **Leer la última sessión encontrada.** Con el `sessionID` del resultado, usar
   `kilo_local_recall` en `mode: "read"` para obtener la conversación completa.

4. **Resumir en 5 líneas como máximo:**
   - Qué se estaba haciendo.
   - Qué quedó pendiente.
   - Qué archivo tocar a continuación.
   - Qué comando correr primero.

5. **No repetir todo el histórico.** El usuario ya lo vivió. Solo lo que necesita
   para seguir.

## Lo que esta skill NO hace

- No ejecuta comandos. Es solo research.
- No cambia archivos. Si el resumen dice que falta algo, el usuario o el agente
  deciden hacerlo después.
- No adivina. Si `kilo_local_recall` no encuentra nada, decir que no hay contexto
  disponible y pedir que explique de nuevo.

## Proyecto de referencia

Salmo 27 Librería. Sitio estático en `public/`, desplegado con Cloudflare
Workers. El carrito es la parte activa: `public/js/carrito.js`,
`public/css/carrito.css`, pruebas en `pruebas/`.