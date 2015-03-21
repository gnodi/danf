({
    baseUrl: '.',
    name: 'lib/client/main.js',
    out: 'main-built.js',
    optimize: 'none',
    absolutise: true,
    cjsTranslate: true,
    paths: {
        'jquery': 'node_modules/jquery/dist/jquery'
    },
    map: {
        // Use no conflict jQuery.
        '*': { 'jquery': 'lib/client/vendor/jquery' },
        'lib/client/vendor/jquery': { 'jquery': 'jquery' }
    }
})