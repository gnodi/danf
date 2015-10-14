'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Escaper = require('../../../lib/common/manipulation/escaper')
;

var escaper = new Escaper(),
    source = '@foo@bar%_',
    embeddedSource = {
        foo: {
            bar: '@foo@bar%_'
        },
        bar: '@foo@bar%_',
        a: 'b$',
        d: '{"c":"b@a@"}'
    },
    escapedStrings = ['@', '%_', '$'],
    escapedSource = '\\@\\foo\\@\\bar\\%_\\',
    unescapedSource = source
;

describe('Escaper', function() {
    describe('method "escape"', function() {
        it('should escape strings from a string source', function() {
            source = escaper.escape(source, escapedStrings);

            assert.equal(source, escapedSource);
        })

        it('should escape strings from embedded strings source', function() {
            embeddedSource = escaper.escape(embeddedSource, escapedStrings);

            assert.deepEqual(
                embeddedSource,
                {
                    foo: {
                        bar: escapedSource
                    },
                    bar: escapedSource,
                    a: 'b\\$\\',
                    d: '{"c":"b\\@\\a\\@\\"}'
                }
            );
        })
    })

    describe('method "unescape"', function() {
        it('should unescape strings from a string source', function() {
            source = escaper.unescape(source, escapedStrings);

            assert.equal(source, unescapedSource);
        })

        it('should unescape strings from embedded strings source', function() {
            embeddedSource = escaper.unescape(embeddedSource, escapedStrings);

            assert.deepEqual(
                embeddedSource,
                {
                    foo: {
                        bar: unescapedSource
                    },
                    bar: unescapedSource,
                    a: 'b$',
                    d: '{"c":"b@a@"}'
                }
            );
        })
    })
})