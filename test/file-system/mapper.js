'use strict';

require('../../lib/init');

var assert = require('assert'),
    fs = require('fs'),
    Mapper = require('../../lib/file-system/mapper')
;

var mapper = new Mapper(),
    cssMapper = new Mapper('css'),
    dirname = fs.realpathSync(__dirname + '/../fixtures/file-system').replace(/\\/g, '/')
;

var config = {
    'danf/test': dirname + '/node-modules/test',
    'danf/public': dirname + '/public',
    'danf/test/file': dirname + '/node-modules/test/directory/file.js',
    'danf/test/js.js': dirname + '/node-modules/test/js.js',
    'danf/foo/bar.js': dirname + '/node-modules/foo/bar',
    'danf/protected/public.js': dirname + '/protected/public.js',
    'danf/root': dirname + '/node-modules/foo/..',
    '!danf/test/private': dirname + '/node-modules/test/private',
}

var tests = [
    {
        path: 'danf/test/test',
        expected: dirname + '/node-modules/test/test.js'
    },
    {
        path: 'danf/public/foo',
        expected: dirname + '/public/foo.js'
    },
    {
        path: 'danf/public/foo.js',
        expected: dirname + '/public/foo.js'
    },
    {
        path: 'danf/test/js',
        expected: dirname + '/node-modules/test/js.js'
    },
    {
        path: 'danf/test/file',
        expected: dirname + '/node-modules/test/directory/file.js'
    },
    {
        path: 'danf/protected/public',
        expected: dirname + '/protected/public.js'
    },
    {
        path: 'danf/protected/public.js',
        expected: dirname + '/protected/public.js'
    },
    {
        path: 'danf/foo/bar',
        expected: dirname + '/node-modules/foo/bar.js'
    },
    {
        path: 'danf/root/index',
        expected: dirname + '/node-modules/index.js'
    }
];

var failTests = [
    {
        path: 'danf/teste/test',
        expected: /No mapping found for the path "danf\/teste\/test.js"./
    },
    {
        path: 'danf/protected/private',
        expected: /No mapping found for the path "danf\/protected\/private.js"./
    },
    {
        path: 'danf/protected/public.css',
        expected: /No mapping found for the path "danf\/protected\/public.css"./
    },
    {
        path: 'danf/test/../hack.js',
        expected: /You are not allowed to use ".." in the path "danf\/test\/..\/hack.js"./
    },
    {
        path: 'danf/test/private/index',
        expected: /No mapping found for the path "danf\/test\/private\/index.js"./
    },
    {
        path: 'danf/test/private',
        expected: /No mapping found for the path "danf\/test\/private.js"./
    }
];

describe('Mapper', function() {
    it('method "processConfiguration" should build a mapping from a config', function() {
        mapper.processConfiguration(config);
    })

    tests.forEach(function(test) {
        it('method "match" should match a mapping for a configurated path', function() {
            var result = mapper.match(test.path);

            assert.equal(result, test.expected);
        })
    });

    failTests.forEach(function(test) {
        it('method "match" should fail if no mapping match', function() {
            assert.throws(
                function() {
                    mapper.match(test.path);
                },
                test.expected
            );
        })
    });

    it('should allow to define a default extension', function() {
        cssMapper.processConfiguration({
            'danf/test': dirname + '/node-modules/test'
        });

        var result = cssMapper.match('danf/test/test');

        assert.equal(result, dirname + '/node-modules/test/test.css');
    })
})