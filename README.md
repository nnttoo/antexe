# antexe

> An interactive CLI script runner for `package.json` with built-in script filtering.

`antexe` is an interactive CLI tool that allows you to easily select and execute scripts defined in your `package.json` using keyboard navigation. It also lets you exclude specific internal or utility scripts from the interactive menu.

---

## 📦 Features

* 🎯 **Interactive Menu:** Clean keyboard-navigable selection interface using arrow keys.
* 📝 **Command Hints:** Displays the actual command of each script as a hint/description.
* 🚫 **Script Filtering:** Hide unwanted or internal scripts (e.g., `build`, `ui`, `start`) using the `--skip` option.
* ⚡ **Graceful Process Handling:** Forwards `SIGINT` (`Ctrl + C`) signals directly to child processes to prevent terminal hangs.

---

## 🚀 Installation

Install as a dev dependency in your project:

```bash
npm install -D antexe
```

Or install globally to use across any project:

```bash
npm install -g antexe
```

---

## 💻 Usage

### 1. Inside `package.json`

Add `antexe` to your `package.json` scripts section:

```json
{
  "name": "my-app",
  "scripts": {
    "start": "antexe --skip start,build,ui",
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

Run the interactive menu with:

```bash
npm start
```

### 2. Direct Execution via `npx`

Run it directly in your terminal without modifying `package.json`:

```bash
npx antexe --skip build,lint
```

---

## ⚙️ Options

| Flag | Alias | Type | Description |
| :--- | :--- | :--- | :--- |
| `--skip` | `-s` | `string` | Comma-separated list of script names to hide from the menu. |

**Example:**
```bash
antexe --skip start,build,test
```

---

## 📄 License

[MIT](LICENSE)