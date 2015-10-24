'use strict';

var assert = require('assert'),
    path = require('path'),
    danf = require('../../lib/server/app')
;

var rootPath = path.join(__dirname, '/../fixture/proto');

describe('Danf proto application', function() {
    it('should build its configuration from files, folders and node modules', function() {
        assert.deepEqual(
            danf.prototype.buildServerConfiguration(rootPath, 'danf'),
            {
                config: {
                    classes: {}
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
                                dependencies: {}
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
                    classes: {}
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
                                dependencies: {}
                            }
                        }
                    }
                }
            }
        );
    })
})