/* eslint import/no-extraneous-dependencies: 0 */

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const { eslint } = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const { uglify } = require('rollup-plugin-uglify')
const string = require('rollup-plugin-string')
const json = require('rollup-plugin-json')

const defaultPlugins = [
  json({
    include: 'package.json'
  }),
  string({
    include: '**/*.css'
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/bluebird/js/browser/bluebird.js': ['promisify']
    }
  }),
  eslint({
    exclude: ['src/css/**', 'node_modules/**', 'lib/images/**']
  }),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true
  })
]

const inputOptions = min => ({
  input: 'src/index.js',
  plugins: min ? [...defaultPlugins, uglify()] : defaultPlugins
})

const outputOptions = min => ({
  format: 'umd',
  file: min ? 'build/assist.min.js' : 'build/assist.js',
  name: 'assist',
  globals: {
    bluebird: 'promisify',
    bowser: 'bowser'
  },
  sourceMap: 'inline'
})

async function build() {
  // create a regular bundle
  const bundle = await rollup.rollup(inputOptions())
  await bundle.write(outputOptions())

  // create a minified bundle
  const minBundle = await rollup.rollup(inputOptions('min'))
  await minBundle.write(outputOptions('min'))
}

build()
