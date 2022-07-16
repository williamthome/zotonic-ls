import typescript from '@rollup/plugin-typescript';

const onwarn = (warning) => {
    warning.code !== 'CIRCULAR_DEPENDENCY' &&
        // eslint-disable-next-line no-undef
        console.warn(`(!) ${warning.message}`);
};

export default {
    input: 'src/extension.ts',
    output: {
        dir: 'out',
        format: 'cjs',
        sourcemap: true,
    },
    external: ['vscode', 'vscode-html-languageservice', 'axios', 'path', 'fs'],
    plugins: [typescript()],
    onwarn,
};
