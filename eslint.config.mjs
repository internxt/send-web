import eslintConfigInternxt from '@internxt/eslint-config-internxt';

export default [
    {
        ignores: ['build', 'coverage', 'node_modules'],
    },
    ...eslintConfigInternxt,
];
