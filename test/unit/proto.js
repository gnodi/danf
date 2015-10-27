'use strict';

var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    danf = require('../../lib/server/app')
;

var rootPath = fs.realpathSync(path.join(__dirname, '/../fixture/proto')),
    requirePattern = 'require(\'{0}/{1}\')'.format(rootPath, '{0}')
;

describe('Danf proto application', function() {
    it('should build its server configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.prototype.buildSideConfiguration(rootPath, 'danf', 'server'),
            {
                config: {
                    classes: {
                        'foo.bar': requirePattern.format('lib/common/foo/bar.js'),
                        bar: requirePattern.format('lib/server/bar.js'),
                        foo: requirePattern.format('lib/common/foo.js'),
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
                                                    message: {}
                                                }
                                            },
                                            oldTopic: {},
                                            topic: {}
                                        }
                                    }
                                }
                            }
                        },
                        dependencies: {
                            c: {
                                contract: {},
                                dependencies: {},
                                config: {
                                    classes: {
                                        'foo.bar': requirePattern.format('node_modules/a/node_modules/c/lib/server/foo/bar.js')
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
            danf.prototype.buildSideConfiguration(rootPath, 'danf', 'client'),
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
                            'dep1.subdep2': {key: 'value'},
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
                            }
                        }
                    }
                }
            }
        );
    })
})