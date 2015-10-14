module.exports = ({
    baseUrl: '.',
    name: 'lib/client/main',
    out: '.bin/main.js',
    optimize: 'none',
    absolutise: true,
    cjsTranslate: true,
    paths: {
        'async': 'async/lib/async',
        /*'chalk': 'chalk/index',
        'escape-string-regexp': 'chalk/node_modules/escape-string-regexp/index',
        'ansi-styles': 'chalk/node_modules/ansi-styles/index',
        'strip-ansi': 'chalk/node_modules/strip-ansi/index',
        'ansi-regex': 'chalk/node_modules/strip-ansi/node_modules/ansi-regex/index',
        'has-ansi': 'chalk/node_modules/has-ansi/index',
        'supports-color': 'chalk/node_modules/supports-color/index',*/
        'jquery': 'jquery/dist/jquery'
    },
    map: {
        // Use no conflict jQuery.
        '*': { 'jquery': 'lib/client/vendor/jquery' },
        'lib/client/vendor/jquery': { 'jquery': 'jquery' }
    }
});