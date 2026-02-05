import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  ignores: ['build', 'coverage', 'pnpm-lock.yaml', 'src/leetcode'],
  rules: {
    'no-console': 'off',
    'jsdoc/require-returns-description': 'off',
    'no-labels': 'off',
  },
})
