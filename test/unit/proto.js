'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    danf = require('../../lib/server/app')({}, {}, {}, {})
;

var rootPath = fs.realpathSync(path.join(__dirname, '/../fixture/proto/app')),
    dependenciesPath =  fs.realpathSync(path.join(__dirname, '/../fixture/proto/dependencies')),
    requirePattern = 'require(\'{0}/{1}\')'.format(rootPath, '{0}')
;

var pathInterpretationTests = [
        {
            input: 'foo-bar',
            output: 'fooBar'
        },
        {
            input: '-foo-bar',
            output: 'FooBar'
        },
        {
            input: 'foo-.bar',
            output: 'foo-bar'
        },
        {
            input: 'foo.bar',
            output: 'foo.bar'
        },
        {
            input: 'foo&dev',
            output: 'foo/dev'
        },
        {
            input: 'foo.-bar',
            output: 'foo.Bar'
        },
        {
            input: 'foo~bar',
            output: 'foo~bar'
        },
        {
            input: 'foo~.bar',
            output: 'foo~.bar'
        },
        {
            input: 'foo;bar',
            output: 'foo:bar'
        },
        {
            input: 'ab-c-d-.efg.hI.-jk~l;mn.op~qrs.-t-.uvw&xyz',
            output: 'abCD-efg.hI.Jk~l:mn.op~qrs.T-uvw/xyz'
        },
        {
            input: 'abc{0}def{0}ghi'.format(path.sep),
            output: 'abc~def~ghi'
        },
        {
            input: 'abc{0}def.{0}ghi'.format(path.sep),
            output: 'abc~def.ghi'
        },
        {
            input: 'abc{0}def.ghi'.format(path.sep),
            output: 'abc.def.ghi',
            pathSeparator: '.'
        }
    ]
;

var pathSplitTests = [
        {
            input: 'abc-def.gh',
            output: ['abc-def.gh']
        },
        {
            input: 'ab~cde.f',
            output: ['ab', 'cde.f']
        },
        {
            input: 'ab~cde~fgHi',
            output: ['ab', 'cde', 'fgHi']
        },
        {
            input: 'ab~.cde~FgH.~i~.jk',
            output: ['ab~cde', 'FgH.', 'i~jk']
        },
        {
            input: 'abCD-efg.hI.Jk~l:mn.op~qrs.T-uvw/xyz',
            output: ['abCD-efg.hI.Jk', 'l:mn.op', 'qrs.T-uvw/xyz']
        }
    ]
;

var clusterInterpretationTests = [
        {
            input: {}
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 2000,
                        workers: 1
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 2000,
                    workers: 1,
                    proxy: true
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: 8
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 8,
                    proxy: true
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: 9
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 9,
                    proxy: true
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: 2
                    },
                    {
                        listen: 'command',
                        port: 200,
                        workers: 3
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 2,
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 3,
                    proxy: false
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: -1
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 7,
                    proxy: true
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: -1
                    },
                    {
                        listen: 'command',
                        port: 200,
                        workers: 2
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 5,
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 2,
                    proxy: false
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        workers: 0
                    }
                ]
            },
            max: 10,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 10,
                    proxy: true
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100
                    },
                    {
                        listen: 'command',
                        port: 200
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 1,
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 1,
                    proxy: false
                }
            ]
        },
        {
            input: {
                cluster: [
                    {
                        listen: 'http',
                        port: 100
                    },
                    {
                        listen: 'command',
                        port: 200,
                        workers: -3
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 1,
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 4,
                    proxy: false
                }
            ]
        },
        {
            input: {
                foo: 'bar',
                cluster: [
                    {
                        listen: 'http',
                        port: 100,
                        bar: 'foo'
                    },
                    {
                        listen: 'command',
                        port: 200,
                        workers: -3
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: 'http',
                    port: 100,
                    workers: 1,
                    foo: 'bar',
                    bar: 'foo',
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 4,
                    foo: 'bar',
                    proxy: false
                }
            ]
        },
        {
            input: {
                foo: 'bar',
                cluster: [
                    {
                        listen: ['http', 'socket'],
                        port: 100,
                        bar: 'foo'
                    },
                    {
                        listen: 'command',
                        port: 200,
                        workers: -3
                    }
                ]
            },
            max: 8,
            output: [
                {
                    listen: ['http', 'socket'],
                    port: 100,
                    workers: 1,
                    foo: 'bar',
                    bar: 'foo',
                    proxy: true
                },
                {
                    listen: 'command',
                    port: 200,
                    workers: 4,
                    foo: 'bar',
                    proxy: false
                }
            ]
        },
        {
            input: {
                listen: 'http'
            },
            max: 8,
            output: /A listening server must define a port\./,
            errored: true
        },
        {
            input: {
                listen: 'dumb',
                port: 100
            },
            max: 8,
            output: /Server of type "dumb" are not handled\./,
            errored: true
        },
        {
            input: {
                listen: ['http', 'dumb', 'socket'],
                port: 100
            },
            max: 8,
            output: /Server of type "dumb" are not handled\./,
            errored: true
        },
        {
            input: {
                foo: 'bar',
                cluster: [
                    {
                        listen: ['http', 'socket']
                    }
                ]
            },
            max: 8,
            output: /A listening server must define a port\./,
            errored: true
        },
        {
            input: {
                foo: 'bar',
                port: 100,
                cluster: [
                    {
                        listen: ['http', 'command']
                    }
                ]
            },
            max: 8,
            output: /Server of type "command" cannot share listening\./,
            errored: true
        },
        {
            input: {
                foo: 'bar',
                port: 300,
                cluster: [
                    {
                        listen: ['http']
                    },
                    {
                        listen: ['socket']
                    }
                ]
            },
            output: /Cannot use the same port "300" for different cluster chunks\./,
            errored: true
        },
        {
            input: {
                foo: 'bar',
                port: 300,
                cluster: [
                    {
                        listen: ['http'],
                        workers: -2,
                    },
                    {
                        listen: 'socket',
                        port: 200,
                        workers: 0
                    }
                ]
            },
            output: /Cannot define many filler chunk in a cluster\./,
            errored: true
        }
    ]
;

describe('Danf proto application', function() {
    pathInterpretationTests.forEach(function(test) {
        it('should interpret paths', function() {
            var path = danf.interpretPath(test.input, test.pathSeparator || '~');

            assert.equal(path, test.output);
        })
    });

    pathSplitTests.forEach(function(test) {
        it('should split interpreted paths', function() {
            var path = danf.splitPath(test.input);

            assert.deepEqual(path, test.output);
        })
    });

    clusterInterpretationTests.forEach(function(test) {
        it('should interpret cluster', function() {
            if (!test.errored) {
                var cluster = danf.interpretCluster(test.input, test.max);

                assert.deepEqual(cluster, test.output);
            } else {
                assert.throws(
                    function() {
                        danf.interpretCluster(test.input, test.max);
                    },
                    test.output
                );
            }
        })
    });

    it('should build its server configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.buildSideConfiguration(rootPath, 'server'),
            {
                config: {
                    classes: {
                        'foo.bar': require(path.join(rootPath, 'lib/common/foo/bar.js')),
                        bar: require(path.join(rootPath, 'lib/server/bar.js')),
                        foo: require(path.join(rootPath, 'lib/common/foo.js')),
                        main: require(path.join(rootPath, 'lib/main.js'))
                    }
                },
                dependencies: {
                    a: {
                        config: {
                            events: {
                                request: {
                                    compute: {
                                        path: 'computing',
                                        methods: ['get'],
                                        view: {
                                            html: {
                                                body: {
                                                    file: './computing.jade'
                                                }
                                            }
                                        }
                                    },
                                    api: {
                                        children: {
                                            user: {
                                                path: 'users',
                                                methods: ['get', 'post', 'put'],
                                                view: {
                                                    html: {
                                                        body: {
                                                            file: './user.jade'
                                                        }
                                                    }
                                                },
                                                children: {
                                                    message: {},
                                                    post: {}
                                                }
                                            },
                                            oldTopic: {},
                                            topic: {},
                                            'message-get.foo': {},
                                            'message-get.bar.abc': 123
                                        }
                                    }
                                }
                            }
                        },
                        dependencies: {
                            b: {
                                dependencies: {},
                                config: {
                                    classes: {
                                        'bar': require(path.join(rootPath, 'node_modules/a/node_modules/b/lib/common/bar.js'))
                                    }
                                }
                            },
                            c: {
                                contract: {},
                                dependencies: {},
                                config: {
                                    classes: {
                                        'foo.bar': require(path.join(rootPath, 'node_modules/a/node_modules/c/lib/server/foo/bar.js'))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
    })

    it('should build its client configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.buildSideConfiguration(rootPath, 'client'),
            {
                config: {
                    classes: {
                        'foo.bar': requirePattern.format('lib/common/foo/bar.js'),
                        bar: requirePattern.format('lib/common/bar.js'),
                        foo: requirePattern.format('lib/client/foo.js'),
                        main: require(path.join(rootPath, 'lib/main.js'))
                    }
                },
                dependencies: {
                    a: {
                        config: {
                            this: {foo: 'bar'},
                            'dep1.subdep2': {
                                'key.': 'value',
                                'indexAb': 12,
                                'indexCde': 345
                            },
                            events: {
                                request: {
                                    compute: {
                                        path: 'computing',
                                        methods: ['get'],
                                        view: {
                                            html: {
                                                body: {
                                                    file: './computing.jade'
                                                }
                                            }
                                        }
                                    },
                                    api: {
                                        children: {
                                            user: {
                                                methods: ['get', 'post'],
                                                view: {
                                                    html: {
                                                        body: {
                                                            file: './user.jade'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            'events/dev': {
                                request: {
                                    compute: {
                                        path: 'computing/dev',
                                        methods: ['get'],
                                        view: {
                                            html: {
                                                body: {
                                                    file: './computing.jade'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        contract: {},
                        dependencies: {
                            b: {
                                contract: {},
                                dependencies: {},
                                config: {
                                    classes: {
                                        bar: requirePattern.format('node_modules/a/node_modules/b/lib/common/bar.js'),
                                        foo: requirePattern.format('node_modules/a/node_modules/b/lib/client/foo.js')
                                    }
                                }
                            },
                            c: {
                                dependencies: {},
                                config: {}
                            }
                        }
                    }
                }
            }
        );
    })

    it('should build dependencies tree', function() {
        assert.deepEqual(
            danf.buildDepenciesTree(rootPath),
            {}
        );
    })
})