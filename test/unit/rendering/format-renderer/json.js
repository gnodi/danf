'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    danf = require('../../../../lib/server/app'),
    Json = require('../../../../lib/server/rendering/format-renderer/json')
;

var app = danf(require(__dirname + '/../../../fixtures/rendering/danf'), {listen: false, environment: 'test'}),
    json = new Json(),
    response = app.response
;

response.req = app.request;

var config = {
        select: ['topic', 'messages']
    },
    expected = {
        topic: 'foo',
        messages: ['foo', 'bar']
    },
    context = {
        foo: 'bar',
        topic: expected.topic,
        messages: expected.messages
    }
;

describe('Json', function() {
    it('method "render" should call the passed callback method after the content computing', function(done) {
        json.render(response, context, config, function(content) {
            assert.equal(
                content,
                JSON.stringify(expected)
            );

            done();
        });
    })
})