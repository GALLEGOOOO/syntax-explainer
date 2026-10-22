<h1 align="center">🧠 Syntax Explainer</h1>

<p align="center">
  <b>Pasa el ratón sobre una palabra clave y entiende qué hace, en español.</b><br>
  Tu compañero para aprender a programar en VS Code y Cursor.
</p>

<p align="center">
  <img alt="Versión" src="https://img.shields.io/badge/versión-0.2.0-7c3aed?style=for-the-badge">
  <img alt="Lenguajes" src="https://img.shields.io/badge/lenguajes-20-0ea5e9?style=for-the-badge">
  <img alt="Frameworks" src="https://img.shields.io/badge/frameworks-React_·_Vue_·_Angular-61dafb?style=for-the-badge">
  <img alt="Entradas" src="https://img.shields.io/badge/explicaciones-2172-f59e0b?style=for-the-badge">
  <img alt="Idioma" src="https://img.shields.io/badge/idioma-español-ef4444?style=for-the-badge">
  <img alt="Licencia" src="https://img.shields.io/badge/licencia-MIT-22c55e?style=for-the-badge">
  <img alt="Hecho con amor" src="https://img.shields.io/badge/hecho_con-❤️-ec4899?style=for-the-badge">
</p>

<p align="center">
  <img alt="VS Code" src="https://img.shields.io/badge/VS_Code-%5E1.80.0-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white">
  <img alt="Cursor" src="https://img.shields.io/badge/Cursor-compatible-000000?style=flat-square">
  <img alt="Sin dependencias" src="https://img.shields.io/badge/dependencias-0-14b8a6?style=flat-square">
</p>

---

## ✨ Características

- 💬 **Explicaciones en español** claras y pensadas para principiantes, en una o dos frases.
- 🤝 **No sustituye nada:** el hover normal (tipos, firmas, documentación) sigue apareciendo y la explicación se añade al lado.
- 🌍 **20 lenguajes y formatos + React, Vue y Angular**, con **2172 explicaciones:** JavaScript, TypeScript, React, Vue, Angular, HTML, CSS, PHP, Python, Java, C#, C, C++, Go, Rust, Kotlin, Swift, Dart, Bash, SQL, JSON, YAML y Markdown.
- 📚 **Más que palabras clave:** métodos (`map`, `filter`, `push`…), funciones integradas (`len`, `array_map`, `malloc`…), hooks, directivas, propiedades CSS, unidades, tipos utilitarios de TypeScript y comandos de terminal.
- 🎯 **Inteligente:** solo palabras completas, ignora cadenas y comentarios, sin distinguir mayúsculas en SQL y HTML, entiende `#include`, `println!`, `$HOME`, `v-if`, `*ngIf`, `@media` o `16px`, y en JSON/YAML solo explica claves de configuración conocidas.
- ☁️ **Diccionario remoto opcional** desde un repo privado de GitHub, con caché y actualización cada 24 h.
- 🔐 **Token seguro** en el almacén de secretos del editor, nunca en los ajustes.
- ✏️ **Fácil de ampliar:** un archivo JSON por lenguaje.
- 🪶 **Ligero:** sin dependencias.

## 🖱️ Ejemplo

Pasa el ratón sobre `function` en un archivo JavaScript:

```js
function saludar(nombre) {
  return `Hola, ${nombre}`;
}
```

Y verás, debajo del hover habitual:

```text
function saludar(nombre: any): string
────────────────────────────────────────
function — Declara una función: un bloque de código que puedes ejecutar.
```

## 🌐 Lenguajes soportados

| | Lenguaje | IDs de VS Code | Entradas |
|:-:|---|---|:-:|
| 🟨 | JavaScript | `javascript` (+ base de TS, JSX, Vue) | **211** |
| 🟦 | TypeScript | `typescript`, `typescriptreact` (+ JS) | **59** |
| ⚛️ | React / JSX | `javascriptreact`, `typescriptreact` | **78** |
| 🟩 | Vue | `vue` (+ JS + HTML) | **48** |
| 🅰️ | Angular | `typescript`, `html` | **49** |
| 🟧 | HTML | `html`, `vue` | **158** |
| 🎨 | CSS | `css`, `scss`, `less` | **180** |
| 🐘 | PHP | `php` | **156** |
| 🐍 | Python | `python` | **149** |
| ☕ | Java | `java` | **149** |
| 🟪 | C# | `csharp` | **96** |
| 🔧 | C | `c`, `cpp` | **77** |
| ➕ | C++ | `cpp` (+ C) | **61** |
| 🐹 | Go | `go` | **72** |
| 🦀 | Rust | `rust` | **84** |
| 🟣 | Kotlin | `kotlin` | **78** |
| 🍎 | Swift | `swift` | **77** |
| 🎯 | Dart / Flutter | `dart` | **77** |
| 🐚 | Bash / Shell | `shellscript` | **75** |
| 🗄️ | SQL | `sql` | **135** |
| 📦 | JSON (claves de package.json, tsconfig…) | `json`, `jsonc` | **41** |
| ⚙️ | YAML (GitHub Actions, Docker Compose, Kubernetes) | `yaml` | **40** |
| 📝 | Markdown | `markdown` | **22** |
| | **Total** | | **2172** |

> [!NOTE]
> Kotlin, Swift, Dart, Vue y Rust necesitan que tengas instalada la extensión de ese lenguaje para que el editor reconozca los archivos.

## 📦 Instalación

1. Descarga `syntax-explainer-0.2.0.vsix`.
2. Abre la Paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Ejecuta **`Extensions: Install from VSIX...`** y elige el archivo.
4. Recarga la ventana si te lo pide. ¡Listo! 🎉

> [!TIP]
> Funciona igual en **Cursor** y en **VS Code**.

## ⚙️ Ajustes

| Ajuste | Tipo | Por defecto | Descripción |
|---|:-:|---|---|
| `syntaxExplainer.enabled` | `boolean` | `true` | Activa o desactiva las explicaciones. |
| `syntaxExplainer.remoteUrl` | `string` | API de GitHub de `GALLEGOOOO/syntax-explainer` | URL del diccionario remoto. Déjalo vacío para usar solo el local. |

## ⌨️ Comandos

| Comando | Qué hace |
|---|---|
| `Syntax Explainer: Configurar token de GitHub` | Guarda tu token de forma segura y descarga el diccionario. |
| `Syntax Explainer: Actualizar diccionario ahora` | Descarga el diccionario remoto al momento. |
| `Syntax Explainer: Borrar token` | Elimina el token guardado. |

## 🔑 Diccionario remoto (repo privado)

La extensión descarga `diccionario.json` del repo privado `GALLEGOOOO/syntax-explainer` al arrancar y luego cada 24 h. Sus entradas tienen prioridad sobre las locales.

<details>
<summary><b>👉 Cómo crear el token (2 minutos)</b></summary>

1. En GitHub ve a **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Ponle nombre y caducidad.
3. En **Repository access** elige **Only select repositories** y marca solo `syntax-explainer`.
4. En **Permissions → Repository permissions** pon **Contents: Read-only** (Metadata: Read-only se añade solo). Nada más.
5. Genera el token y cópialo.
6. En el editor ejecuta **`Syntax Explainer: Configurar token de GitHub`** y pégalo.

</details>

> [!IMPORTANT]
> El token se guarda cifrado con SecretStorage, **nunca** en `settings.json`.

> [!NOTE]
> Sin token o sin conexión no pasa nada: se usa la última copia en caché o el diccionario local, sin mensajes de error.

## ✏️ Añadir palabras

Cada diccionario tiene su archivo en `src/keywords/<nombre>.json` (`angular`, `c`, `cpp`, `csharp`, `css`, `dart`, `go`, `html`, `java`, `javascript`, `json`, `kotlin`, `markdown`, `php`, `python`, `react`, `rust`, `shellscript`, `sql`, `swift`, `typescript`, `vue`, `yaml`):

```json
{
  "function": "Declara una función: un bloque de código que puedes ejecutar."
}
```

- 🔡 En **SQL** y **HTML** escribe la palabra en minúsculas.
- ➖ En **CSS** se admiten guiones, `@` y `:` (`justify-content`, `@media`, `:hover`).
- 💲 En **PHP** y **Bash** puedes incluir `$` (`$this`, `$HOME`, `$#`).
- #️⃣ En **C/C++** las directivas llevan `#` (`#include`); en **Rust** las macros llevan `!` (`println!`).
- 🔗 Algunos lenguajes combinan diccionarios (TS = JS + TypeScript + Angular, Vue = JS + HTML + Vue, C++ = C + C++); gana el más específico.
- 🧰 También puedes añadir entradas en bloque: `node tools/add.js <nombre> < lista.txt` (una línea `palabra|texto` por entrada).

Después:

```bash
npm run diccionario   # regenera diccionario.json
npm test              # comprueba que todo está bien
npx @vscode/vsce package
```

> [!TIP]
> Para cambiar textos **sin reinstalar**, edita `diccionario.json` en el repo y ejecuta `Syntax Explainer: Actualizar diccionario ahora`.

## ❓ Preguntas frecuentes

<details>
<summary><b>¿Por qué no veo la explicación en un comentario o en un texto?</b></summary>

Es a propósito: la extensión ignora cadenas y comentarios (con una detección sencilla por línea).
</details>

<details>
<summary><b>Tengo dos explicaciones repetidas</b></summary>

Probablemente tienes instalada una versión antigua (<code>arnau.explicador-palabras-clave</code> o <code>arnau.syntax-explainer</code>). Desinstálala: el identificador actual es <code>GALLEGOSSJ.syntax-explainer</code>.
</details>

<details>
<summary><b>Tras actualizar, el diccionario remoto no carga</b></summary>

Al cambiar el identificador de la extensión, el token y la caché anteriores no se conservan. Vuelve a ejecutar <code>Syntax Explainer: Configurar token de GitHub</code>.
</details>

<details>
<summary><b>¿En HTML sale la explicación sobre texto normal?</b></summary>

Sí, en HTML las palabras coinciden en cualquier parte del archivo (por ejemplo, «a» en una frase). Lo mejoraremos en próximas versiones.
</details>

<details>
<summary><b>¿Por qué en un archivo TypeScript aparecen explicaciones de Angular?</b></summary>

Los términos de Angular (<code>ngOnInit</code>, <code>Component</code>, <code>signal</code>…) se aplican a todos los archivos TypeScript y HTML, porque el editor no distingue un proyecto Angular de otro. Tienen la prioridad más baja, así que nunca tapan una explicación de JavaScript o TypeScript.
</details>

---

<p align="center">
  Hecho con ❤️ por <b>GALLEGOSSJ</b> · Licencia MIT
</p>
