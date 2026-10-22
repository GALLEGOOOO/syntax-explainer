# Changelog

Todos los cambios importantes de **Syntax Explainer**.

## [0.3.0] - 2026-10-22
### Eliminado
- Diccionario remoto (ajuste `syntaxExplainer.remoteUrl`, descarga, caché y comando "Actualizar diccionario ahora").
- Token de GitHub (comandos "Configurar token" y "Borrar token" y uso de SecretStorage). La extensión ya no se conecta a internet; las nuevas palabras llegan con nuevas versiones.
- `diccionario.json` y el script `npm run diccionario`.
### Añadido
- Campos `homepage` y `bugs`, este CHANGELOG y una guía para contribuir en el README.
### Cambiado
- README preparado para publicar en Visual Studio Marketplace y Open VSX.

## [0.2.1] - 2026-10-22
### Añadido
- Icono `< i >` y color de banner `#0b0b0f`.

## [0.2.0] - 2026-10-22
### Añadido
- 2172 explicaciones en total.
- Nuevos diccionarios: TypeScript, C#, C, C++, Go, Rust, Kotlin, Swift, Dart, Bash, JSON, YAML, Markdown, Vue y Angular.
- Ampliados JavaScript, React, HTML, CSS, PHP, Python, Java y SQL.
- Reconocimiento de `#include`, `println!`, `$HOME`, `v-if`, `*ngIf`, unidades CSS (`16px`) y pseudoclases.
### Corregido
- Las propiedades CSS no se detectaban por incluir los dos puntos.
- El selector CSS `* {` se trataba como comentario.

## [0.1.1] - 2026-10-22
### Cambiado
- Publisher `GALLEGOSSJ`, metadatos para el Marketplace y README renovado.

## [0.1.0] - 2026-10-22
### Cambiado
- La extensión pasa a llamarse **Syntax Explainer**.

## [0.0.3] - 2026-10-22
### Añadido
- Diccionario remoto desde un repositorio privado de GitHub con token.

## [0.0.2] - 2026-10-22
### Añadido
- HTML, CSS, React, PHP, Python, Java y SQL.

## [0.0.1] - 2026-10-22
### Añadido
- Primera versión: explicaciones en español para JavaScript y TypeScript.
