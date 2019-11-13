import babel from 'rollup-plugin-babel';

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: 'lib/index.js',
                format: 'cjs',
                sourcemap: false,
            },
            {
                file: 'lib/index.esm.js',
                format: 'esm',
                sourcemap: false,
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**/*',
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false
                        }
                    ]
                ]
            })
        ]
    }
];
