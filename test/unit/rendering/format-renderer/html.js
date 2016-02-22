'use strict';

require('../../../../lib/common/init');

var assert = require('assert'),
    danf = require('../../../../lib/server/app')(require('../../../fixture/rendering/danf'), '', {environment: 'test', verbosity: 0, cluster: null}),
    Html = require('../../../../lib/server/rendering/format-renderer/html')
;

danf.buildServer(function(app) {
    var html = new Html(),
        response = app.response,
        dirname = __dirname + '/../../../fixture/rendering/'
    ;

    html.requestProvider = {
        provide: function() { return {}; }
    }

    response.req = app.request;

    var config = {
            layout: {
                file: dirname + 'layout.jade'
            },
            body: {
                file: dirname + 'index.jade'
            }
        },
        context = {
            title: 'Html Format Renderer Test',
            body: '<p>Body</p>'
        },
        callback = function(content) {
            assert.equal(
                content,
                '<!DOCTYPE html><html><head><title>' + context.title + '</title></head><body><p>&lt;p&gt;Body&lt;/p&gt;</p></body></html>'
            );
        }
    ;

    var embeddedConfig = {
            layout: {
                file: dirname + 'layout.jade'
            },
            body: {
                file: dirname + 'embedded.jade',
                embed: {
                    a: {
                        file: dirname + 'a.jade',
                        embed: {
                            c: {
                                file: dirname + 'c.jade'
                            },
                            d: {
                                file: dirname + 'd.jade',
                                embed: {
                                    e: {
                                        file: dirname + 'e.jade'
                                    }
                                }
                            },
                            f: {
                                file: dirname + 'f.jade'
                            }
                        }
                    },
                    b: {
                        file: dirname + 'b.jade',
                        embed: {
                            d: {
                                file: dirname + 'd.jade',
                                embed: {
                                    e: {
                                        file: dirname + 'f.jade'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        embeddedContext = {
            title: 'Html Format Renderer Embedded Test'
        },
        embeddedCallback = function(content) {
            assert.equal(
                content,
                '<!DOCTYPE html><html><head><title>' + embeddedContext.title + '</title></head><body><p><p><p>c</p></p><p><p><p>e</p></p></p></p><p><p><p><p>f</p></p></p></p></body></html>'
            );
        }
    ;

    describe('Html', function() {
        it('method "render" should call the passed callback method after the content computing', function(done) {
            html.render(response, context, config, function(content) {
                assert.equal(
                    content,
                    '<!DOCTYPE html><html><head><title>Html Format Renderer Test<\/title><\/head><body><p>&lt;p&gt;Body&lt;\/p&gt;<\/p><\/body><\/html>'
                );

                done();
            });
        })

        it('method "render" should render a response', function() {
            html.render(response, context, config, callback);
        })

        it('method "render" should render a response using the built in view inclusion mechanism', function() {
            html.render(response, embeddedContext, embeddedConfig, embeddedCallback);
        })
    })
});