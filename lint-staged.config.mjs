import { defineConfig } from 'lint-staged'

export default defineConfig({
  '*.{ts,tsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{js,mjs,cjs}': ['prettier --write'],
  '*.{json,md,yaml,yml}': ['prettier --write'],
  '*.css': ['prettier --write'],
})
