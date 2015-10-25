'use strict';

var assert = require('assert'),
    path = require('path'),
    danf = require('../../lib/server/app'),
utils = require('../../lib/common/utils')
;

var rootPath = path.join(__dirname, '/../fixture/proto');

describe('Danf proto application', function() {
    it('should build its configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.prototype.buildServerConfiguration(rootPath, 'danf'),
            {
                config: {
                    classes: {
                        'foo.bar': require(path.join(
                            rootPath,
                            'lib/common/foo/bar.js'
                        )),
                        bar: require(path.join(
                            rootPath,
                            'lib/server/bar.js'
                        )),
                        foo: require(path.join(
                            rootPath,
                            'lib/common/foo.js'
                        ))
                    }
                },
                dependencies: {
                    a: {
                        config: {
                            events: {
                                request: {
                                    compute: {},
                                    api: {
                                        children: {
                                            user: {
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
                                        'foo.bar': require(path.join(
                                            rootPath,
                                            'node_modules/a/node_modules/c/lib/server/foo/bar.js'
                                        ))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );

        assert.deepEqual(
            danf.prototype.buildSpecificConfiguration(rootPath, 'danf', 'client'),
            {
                config: {
                    classes: {
                        'foo.bar': require(path.join(
                            rootPath,
                            'lib/common/foo/bar.js'
                        )),
                        bar: require(path.join(
                            rootPath,
                            'lib/common/bar.js'
                        )),
                        foo: require(path.join(
                            rootPath,
                            'lib/client/foo.js'
                        ))
                    }
                },
                dependencies: {
                    a: {
                        config: {
                            this: {},
                            events: {
                                request: {
                                    compute: {}
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
                                        bar: require(path.join(
                                            rootPath,
                                            'node_modules/a/node_modules/b/lib/common/bar.js'
                                        )),
                                        foo: require(path.join(
                                            rootPath,
                                            'node_modules/a/node_modules/b/lib/client/foo.js'
                                        ))
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