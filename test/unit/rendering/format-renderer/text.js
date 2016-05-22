'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    danf = require('../../../../lib/server/app')(require('../../../fixture/rendering/danf'), null, {environment: 'test', verbosity: 0, cluster: null}),
    ReferenceType = require('../../../../lib/common/manipulation/reference-type'),
    ReferenceResolver = require('../../../../lib/common/manipulation/reference-resolver'),
    Text = require('../../../../lib/server/rendering/format-renderer/text')
;

danf.buildServer(function(app) {
    var referenceType = new ReferenceType(),
        referenceResolver = new ReferenceResolver(),
        text = new Text(),
        response = app.response
    ;

    referenceType.name = '@';
    referenceType.delimiter = '@';
    referenceResolver.addReferenceType(referenceType);
    text.referenceResolver = referenceResolver;
    response.req = app.request;

    var config = {
            value: 'Hello @world@!!'
        },
        expected = 'Hello world!!',
        context = {
            world: 'world'
        }
    ;

    describe('Text', function() {
        it('method "render" should call the passed callback method after the content computing', function(done) {
            text.render(response, context, config, function(content) {
                assert.equal(
                    content,
                    expected
                );

                done();
            });
        })
    })

    run();
});