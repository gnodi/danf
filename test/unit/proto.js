'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    danf = require('../../lib/server/app')({}, {}, {}, {})
;

var rootPath = fs.realpathSync(path.join(__dirname, '/../fixture/proto')),
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

var workersComputationTests = [
        {
            input: {
                http: 1
            },
            max: 8,
            output: {
                http: 1
            }
        },
        {
            input: {
                http: 8
            },
            max: 8,
            output: {
                http: 8
            }
        },
        {
            input: {
                http: 9
            },
            max: 8,
            output: {
                http: 9
            }
        },
        {
            input: {
                http: 2,
                cmd: 3
            },
            max: 8,
            output: {
                http: 2,
                cmd: 3
            }
        },
        {
            input: {
                http: 2,
                cmd: -1
            },
            max: 8,
            output: {
                http: 2,
                cmd: 5
            }
        },
        {
            input: {
                http: 2,
                cmd: 0
            },
            max: 10,
            output: {
                http: 2,
                cmd: 8
            }
        },
        {
            input: {
                http: 3,
                cmd: null
            },
            max: 10,
            output: {
                http: 3,
                cmd: 0
            }
        },
        {
            input: {
                http: 0,
                cmd: -1
            },
            max: 8,
            output: /Cannot define a number lower than or equal to 0 for more than one type of workers./,
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

    workersComputationTests.forEach(function(test) {
        it('should split interpreted paths', function() {
            if (!test.errored) {
                var workersNumbers = danf.computeWorkersNumbers(test.input, test.max);

                assert.deepEqual(workersNumbers, test.output);
            } else {
                assert.throws(
                    function() {
                        danf.computeWorkersNumbers(test.input, test.max);
                    },
                    test.output
                );
            }
        })
    });

    it('should build its server configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.buildSideConfiguration(rootPath, 'danf', 'server'),
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
            danf.buildSideConfiguration(rootPath, 'danf', 'client'),
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
})