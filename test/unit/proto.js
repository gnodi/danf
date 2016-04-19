'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    danf = require('../../lib/server/app')({}, {}, {}, {})
;

var rootPath = fs.realpathSync(path.join(__dirname, '/../fixture/proto')),
    appPath = path.join(rootPath, 'app'),
    dependenciesPath = path.join(rootPath, 'dependencies'),
    dependenciesPath =  fs.realpathSync(path.join(__dirname, '/../fixture/proto/dependencies')),
    requirePattern = 'require(\'{0}/{1}\')'.format(appPath, '{0}')
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

    it('should build dependencies tree', function(done) {
        assert.deepEqual(
            danf.buildDependencies(
                dependenciesPath,
                function(dependencies) {
                    assert.deepEqual(
                        dependencies,
                        {
                            b: {
                                id: 'b@1.0.0',
                                name: 'b',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/b'),
                                dependencies: {}
                            },
                            c: {
                                id: 'c@1.1.0',
                                name: 'c',
                                version: '1.1.0',
                                versions: ['4.0.0', '3.0.0', '2.0.0', '1.1.0'],
                                conflict: 0,
                                path: path.join(dependenciesPath, 'node_modules/c'),
                                dependencies: {}
                            },
                            d: {
                                id: 'd@1.0.0',
                                name: 'd',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/d'),
                                dependencies: {
                                    e: 'e',
                                    'e:c': 'c',
                                    c: 'c',
                                    f: 'f',
                                    g: 'g',
                                    h: 'h',
                                    j: 'j',
                                    'h:j': 'j',
                                    'h:o': 'o',
                                    o: 'o'
                                }
                            },
                            'd:e': 'e',
                            'd:e:c': 'c',
                            'd:c': 'c',
                            'd:f': 'f',
                            'd:g': 'g',
                            'd:h': 'h',
                            'd:h:j': 'j',
                            'd:j': 'j',
                            'd:h:o': 'o',
                            'd:o': 'o',
                            e: {
                                id: 'e@1.0.0',
                                name: 'e',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/d/node_modules/e'),
                                dependencies: {
                                    c: 'c'
                                }
                            },
                            'e:c': 'c',
                            f: {
                                id: 'f@1.2.0',
                                name: 'f',
                                version: '1.2.0',
                                versions: ['1.2.0', '1.0.0'],
                                conflict: 2,
                                path: path.join(dependenciesPath, 'node_modules/d/node_modules/f'),
                                dependencies: {}
                            },
                            g: {
                                id: 'g@1.0.0',
                                name: 'g',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/d/node_modules/g'),
                                dependencies: {}
                            },
                            h: {
                                id: 'h@2.0.0',
                                name: 'h',
                                version: '2.0.0',
                                versions: ['2.0.0', '1.0.0'],
                                conflict: 0,
                                path: path.join(dependenciesPath, 'node_modules/n/node_modules/h'),
                                dependencies: {
                                    j: 'j',
                                    o: 'o'
                                }
                            },
                            'h:j': 'j',
                            'h:o': 'o',
                            j: {
                                id: 'j@0.0.4-beta',
                                name: 'j',
                                version: '0.0.4-beta',
                                versions: ['0.0.4-beta', '0.0.3-beta', '0.0.1-beta'],
                                conflict: 5,
                                path: path.join(dependenciesPath, 'node_modules/n/node_modules/h/node_modules/j'),
                                dependencies: {}
                            },
                            l: {
                                id: 'l@1.0.0',
                                name: 'l',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/l'),
                                dependencies: {}
                            },
                            m: {
                                id: 'm@1.0.0',
                                name: 'm',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/m'),
                                dependencies: {
                                    c: 'c',
                                    f: 'f',
                                    g: 'g',
                                    j: 'j',
                                    o: 'o'
                                }
                            },
                            'm:c': 'c',
                            'm:f': 'f',
                            'm:g': 'g',
                            'm:j': 'j',
                            'm:o': 'o',
                            n: {
                                id: 'n@1.0.0',
                                name: 'n',
                                version: '1.0.0',
                                versions: ['1.0.0'],
                                path: path.join(dependenciesPath, 'node_modules/n'),
                                dependencies: {
                                    h: 'h',
                                    'h:j': 'j',
                                    j: 'j',
                                    'h:o': 'o',
                                    o: 'o'
                                }
                            },
                            'n:h': 'h',
                            'n:h:j': 'j',
                            'n:j': 'j',
                            'n:h:o': 'o',
                            'n:o': 'o',
                            o: {
                                id: 'o@0.2.0',
                                name: 'o',
                                version: '0.2.0',
                                versions: ['0.2.0', '0.1.1'],
                                conflict: 2,
                                path: path.join(dependenciesPath, 'node_modules/o'),
                                dependencies: {}
                            }
                        }
                    );

                    danf.displayDependencies(dependencies);

                    done();
                }
            )
        );
    })

    it('should build its server configuration from files, folders and node modules', function(done) {
        danf.buildDependencies(
            appPath,
            function(dependencies) {
                assert.deepEqual(
                    danf.buildSideConfiguration(appPath, dependencies, 'server'),
                    {
                        config: {
                            classes: {
                                'foo.bar': require(path.join(appPath, 'lib/common/foo/bar.js')),
                                bar: require(path.join(appPath, 'lib/server/bar.js')),
                                foo: require(path.join(appPath, 'lib/common/foo.js')),
                                main: require(path.join(appPath, 'lib/main.js'))
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
                                    b: 'b',
                                    c: 'c'
                                }
                            },
                            b: {
                                dependencies: {},
                                config: {
                                    classes: {
                                        'bar': require(path.join(appPath, 'node_modules/a/node_modules/b/lib/common/bar.js'))
                                    }
                                }
                            },
                            c: {
                                contract: {},
                                dependencies: {},
                                config: {
                                    classes: {
                                        'foo.bar': require(path.join(appPath, 'node_modules/a/node_modules/c/lib/server/foo/bar.js'))
                                    }
                                }
                            },
                            'a:b': 'b',
                            'a:c': 'c'
                        }
                    }
                );

                done();
            }
        );
    })

    it('should build its client configuration from files, folders and node modules', function() {
        danf.buildDependencies(
            appPath,
            function(dependencies) {
                assert.deepEqual(
                    danf.buildSideConfiguration(appPath, 'client'),
                    {
                        config: {
                            classes: {
                                'foo.bar': requirePattern.format('lib/common/foo/bar.js'),
                                bar: requirePattern.format('lib/common/bar.js'),
                                foo: requirePattern.format('lib/client/foo.js'),
                                main: require(path.join(appPath, 'lib/main.js'))
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
                                    b: 'b',
                                    c: 'c'
                                }
                            },
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
                            },
                            'a:b': 'b',
                            'a:c': 'c'
                        }
                    }
                );

                done();
            }
        );
    })
})