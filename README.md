<h1 align="center">🧠 Syntax Explainer</h1>

<p align="center">
  <b>Pasa el ratón sobre una palabra clave y entiende qué hace, en español.</b><br>
  Tu compañero para aprender a programar en VS Code y Cursor.
</p>

<p align="center">
  <img alt="Versión" src="https://img.shields.io/badge/versión-0.1.1-7c3aed?style=for-the-badge">
  <img alt="Lenguajes" src="https://img.shields.io/badge/lenguajes-9-0ea5e9?style=for-the-badge">
  <img alt="Entradas" src="https://img.shields.io/badge/explicaciones-369-f59e0b?style=for-the-badge">
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
- 🌍 **9 lenguajes:** JavaScript, TypeScript, React/JSX, HTML, CSS (SCSS/Less), PHP, Python, Java y SQL.
- 🎯 **Inteligente:** solo palabras completas, ignora cadenas y comentarios, sin distinguir mayúsculas en SQL y HTML.
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
| 🟨 | JavaScript / TypeScript | `javascript`, `typescript` | **65** |
| ⚛️ | React / JSX | `javascriptreact`, `typescriptreact` (+ JS) | **30** |
| 🟧 | HTML | `html` | **52** |
| 🎨 | CSS | `css`, `scss`, `less` | **46** |
| 🐘 | PHP | `php` | **45** |
| 🐍 | Python | `python` | **44** |
| ☕ | Java | `java` | **42** |
| 🗄️ | SQL | `sql` | **45** |

## 📦 Instalación

1. Descarga `syntax-explainer-0.1.1.vsix`.
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

Cada lenguaje tiene su archivo en `src/keywords/<lenguaje>.json` (`javascript`, `react`, `html`, `css`, `php`, `python`, `java`, `sql`):

```json
{
  "function": "Declara una función: un bloque de código que puedes ejecutar."
}
```

- 🔡 En **SQL** y **HTML** escribe la palabra en minúsculas.
- ➖ En **CSS** se admiten guiones, `@` y `:` (`justify-content`, `@media`, `:hover`).
- 💲 En **PHP** puedes incluir `$` (`$this`, `$_POST`).

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

---

<p align="center">
  Hecho con ❤️ por <b>GALLEGOSSJ</b> · Licencia MIT
</p>
