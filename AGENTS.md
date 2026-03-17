# AGENTS.md - Developer Guidelines for xge

## Overview
This is a Vue 3 + Vite + TypeScript project with Three.js. The codebase supports a dual-app architecture:
- Main app (default): served at port 41201
- Editor app: served at port 41200 (via `VITE_APP_TARGET=editor`)

---

## Build / Lint / Test Commands

### Development
```bash
npm run dev              # Start main app dev server (port 41201)
npm run editor           # Start editor app dev server (port 41200)
```

### Building
```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Linting & Type Checking
- **No ESLint configured** - no lint command available
- Type checking is done via TypeScript compiler (`tsc`) - not exposed as npm script
- Run `npx tsc --noEmit` for type checking

### Testing
- **No test framework configured** - no tests exist in this project
- Manual testing via browser at `localhost:41201` (main) or `localhost:41200` (editor)
- Hot Module Replacement (HMR) is enabled for rapid development

---

## Code Style Guidelines

### General Principles
- Use TypeScript with `strict: true` enabled
- Use Vue 3 Composition API with `<script setup lang="ts">`
- Keep components small and focused
- Use functional patterns where possible

### Imports
```typescript
// Use @ alias for absolute imports from src/
import GameViewer from '@/lib/core-dev/GameViewer.vue'
import Hero from '@/lib/ui-dev/Hero.vue'

// Vue imports - most are auto-imported (see .eslintrc-auto-import.json)
// Only import what you need explicitly when auto-import doesn't work
import { ref, onMounted } from 'vue'

// Relative imports for local files
import test from '../assets/test.webp'
```

### Path Aliases
- `@/` maps to `src/`
- Use `@/` for imports from anywhere in the project

### File Naming
- **Vue components**: PascalCase (`GameViewer.vue`, `Hero.vue`)
- **TypeScript files**: camelCase (`testEdit.ts`, `resources.ts`)
- **Directories**: camelCase or kebab-case (`core-dev`, `test-dev`, `ui-dev`)

### Vue Component Structure
```vue
<template>
  <!-- template content -->
</template>

<script setup lang="ts">
// Props with defaults
const props = withDefaults(defineProps<{ 
  bg?: string 
}>(), { 
  bg: '' 
})

// Component logic
</script>

<style scoped>
/* Scoped styles */
</style>
```

### TypeScript Conventions
- Use explicit types for props and complex data structures
- Use `any` sparingly (this codebase uses it in some places)
- Enable strict mode in tsconfig.json

### Vue Composition API Patterns
- Use `ref()` for primitive values, `reactive()` for objects
- Use `computed()` for derived state
- Use lifecycle hooks: `onMounted`, `onUnmounted`, `onBeforeMount`, etc.
- Most Vue APIs are auto-imported (see `auto-imports.d.ts`)

### State Management
- Uses Pinia for state management
- Stores located in `src/stores/` (auto-imported)
- Composables located in `src/composables/` (auto-imported)

### Error Handling
- No specific error handling patterns enforced
- Use try/catch for async operations
- Vue's `onErrorCaptured` hook available for component error handling

### CSS / Styling
- Use scoped styles (`<style scoped>`)
- CSS files in `src/` follow naming: `anim.css`, `fonts.css`, `reset.css`, `style.css`, `volk.css`

### Image & Asset Handling
- Images imported directly: `import test from '../assets/test.webp'`
- Use `vite-imagetools` for image processing
- Auto-imports work for Vue components and TS files

### Vite Configuration
- Main config: `vite.config.js`
- TypeScript configs: `tsconfig.json`, `tsconfig.node.json`
- Auto-imports config: `auto-imports.d.ts`

### Editor vs Main App
- Root changes based on `VITE_APP_TARGET` env var
- Main app: serves from project root (`index.html`)
- Editor app: serves from `editor/` directory (`editor/index.html`)
- Server port: 41201 (main), 41200 (editor)

---

## Project Structure
```
/home/alex/dev/xge
├── src/                    # Main app source
│   ├── games/              # Game implementations (Game1/)
│   ├── lib/                # Shared libraries
│   │   ├── core-dev/       # Core development utilities
│   │   ├── test-dev/       # Test utilities
│   │   └── ui-dev/         # UI components
│   ├── App.vue             # Root component
│   ├── main.js             # Entry point
│   └── resources.ts       # Dynamic resource loader
├── editor/                 # Editor app
│   ├── src/
│   │   ├── Editor.vue
│   │   └── editor.js
│   └── index.html
├── package.json
├── vite.config.js
├── tsconfig.json
└── tsconfig.node.json
```

---

## Common Tasks

### Adding a new game
1. Create directory under `src/games/` (e.g., `Game2/`)
2. Create a root Vue component (e.g., `Game2.vue`)
3. Import in `src/App.vue`

### Adding a new component
1. Place in appropriate directory under `src/lib/`
2. Use PascalCase for filename
3. Import using `@/` alias

### Dynamic page loading
```typescript
const pages = import.meta.glob('./pages/*.vue')
// Returns: Record<string, () => Promise<unknown>>
```

---

## Notes for Agents
- No formal test framework exists; verify changes manually in browser
- Build output goes to `dist/` directory
- The codebase uses auto-imports heavily for Vue APIs
- Hot Module Replacement works across both apps when running dev servers
