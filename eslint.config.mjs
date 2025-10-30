import eslintConfigInternxt from '@internxt/eslint-config-internxt';

export default [
    {
        ignores: ['dist', 'coverage', 'node_modules'],
    },
    ...eslintConfigInternxt,
];
