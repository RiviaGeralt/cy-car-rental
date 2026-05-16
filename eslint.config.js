import next from 'eslint-config-next';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['.next/**', 'node_modules/**'],
  },
  next
];
