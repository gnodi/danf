'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    InterfacesContainer = require('../../../lib/common/object/interfaces-container')
;

var interfacesContainer = new InterfacesContainer();

var config = {
        a: {
            methods: {
                x: {},
                y: {},
                z: {}
            },
            getters: {
                i: 'number',
                j: 'string'
            },
            setters: {
                i: 'number',
                k: 'object'
            }
        },
        b: {
            extends: 'a',
            methods: {
                u: {},
                v: {}
            }
        }
    }
;

describe('InterfacesContainer', function() {
    interfacesContainer.handleRegistryChange(config);

    it('method "handleRegistryChange" should set the definitions of the configured interfaces and build them', function() {
        assert(interfacesContainer.hasDefinition('a'));
        assert(interfacesContainer.hasDefinition('b'));
        assert(interfacesContainer.has('a'));
        assert(interfacesContainer.has('b'));
    })

    it('method "get" should return an interface with extended members', function() {
        var a = interfacesContainer.get('a'),
            b = interfacesContainer.get('b')
        ;

        assert.equal(a.hasMethod('x'), true);
        assert.equal(a.hasMethod('y'), true);
        assert.equal(a.hasMethod('z'), true);
        assert.equal(a.hasMethod('foo'), false);
        assert.equal(a.hasGetter('i'), true);
        assert.equal(a.hasGetter('j'), true);
        assert.equal(a.hasGetter('k'), false);
        assert.equal(a.hasSetter('i'), true);
        assert.equal(a.hasSetter('j'), false);
        assert.equal(a.hasSetter('k'), true);

        assert.equal(b.hasMethod('x'), true);
        assert.equal(b.hasMethod('foo'), false);
        assert.equal(b.hasMethod('u'), true);
        assert.equal(b.hasMethod('v'), true);
        assert.equal(b.hasGetter('j'), true);
        assert.equal(b.hasGetter('k'), false);
        assert.equal(b.hasSetter('j'), false);
        assert.equal(b.hasSetter('k'), true);
    })

    it('method "setDefinition" allow to add a interface definition', function() {
        interfacesContainer.setDefinition(
            'c',
            {
                extends: 'b',
                methods: {
                    f: {}
                }
            }
        );

        var c = interfacesContainer.get('c');

        assert.equal(c.hasMethod('x'), true);
        assert.equal(c.hasMethod('foo'), false);
        assert.equal(c.hasMethod('f'), true);
        assert.equal(c.hasMethod('v'), true);
        assert.equal(c.hasGetter('j'), true);
        assert.equal(c.hasGetter('k'), false);
        assert.equal(c.hasSetter('j'), false);
        assert.equal(c.hasSetter('k'), true);
    })
})