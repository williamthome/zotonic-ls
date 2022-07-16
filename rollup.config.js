import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const onwarn = (warning) => {
    warning.code !== 'CIRCULAR_DEPENDENCY' &&
        // eslint-disable-next-line no-undef
        console.warn(`(!) ${warning.message}`);
};

export default {
    input: 'src/extension.ts',
    output: [
        {
            file: 'out/extension.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'out/extension.min.js',
            format: 'cjs',
            plugins: [terser()],
        },
    ],
    external: ['vscode', 'vscode-html-languageservice', 'axios', 'path', 'fs'],
    plugins: [typescript()],
    onwarn,
};
