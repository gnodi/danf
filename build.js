module.exports = ({
    baseUrl: '.',
    name: 'lib/client/main',
    out: '.bin/main.js',
    optimize: 'none',
    absolutise: true,
    cjsTranslate: true,
    paths: {
        'async': 'async/lib/async',
        'jquery': 'jquery/dist/jquery'
    },
    map: {
        // Use no conflict jQuery.
        '*': { 'jquery': 'lib/client/vendor/jquery' },
        'lib/client/vendor/jquery': { 'jquery': 'jquery' }
    }
});