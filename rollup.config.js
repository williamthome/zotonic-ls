import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/extension.ts',
    output: {
        dir: 'out',
        format: 'cjs',
        sourcemap: true,
    },
    external: ['vscode', 'vscode-html-languageservice', 'axios', 'path', 'fs'],
    plugins: [typescript()],
};
