const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
  },
})
