'use strict';

var request = require('supertest'),
    assert = require('assert')
;

function ForumHandler() {
    this._topics = {
        General: [
            'Rules',
            'Welcome'
        ],
        News: [
            'The lion is dead tonight.',
            'The third world peace is near.'
        ]
    };

    this._messages = {
        'The third world peace is near.': [
            'OMG! I can\'t believe it!',
            'Make bombs not peace!',
            '???'
        ]
    };
}

ForumHandler.prototype.getTopics = function(forumName) {
    return this._topics[forumName];
};

ForumHandler.prototype.getMessages = function(topicName, page) {
    return this._messages[topicName] ? this._messages[topicName] : [];
};

ForumHandler.prototype.computeForumSize = function(topics, messages) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(count) {
                    return count + topics.length;
                });
            },
            20
        );
    })

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(count) {
                    return count + messages.length;
                });
            },
            20
        );
    })

    return 2;
};

function SubrequestExecutor() {
}

SubrequestExecutor.prototype.execute = function() {
    this._router.follow.__asyncCall(
        this._router,
        'a',
        '/sub',
        'GET'
    );

    this._route.follow.__asyncCall(
        this._router,
        'b'
    );

    this._event.trigger.__asyncCall(
        this._event,
        'c',
        {
            path: '/sub',
            method: 'GET'
        }
    );
};

function SessionTester() {
}

SessionTester.prototype.test = function(order) {
    switch (order) {
        case '0':
            this._sessionHandler.set('a', 1);
            assert.equal(this._sessionHandler.get('a'), 1);

            break;
        case '1':
            this._sessionHandler.set('b', 2);
            assert.equal(this._sessionHandler.get('b'), 2);
            this._sessionHandler.regenerate();
            assert.equal(this._sessionHandler.get('b'), 2);

            break;
        case '2':
            this._sessionHandler.set('c', 3);
            assert.equal(this._sessionHandler.get('c'), 3);
            this._sessionHandler.destroy();

            break;
        case '3':
            this._sessionHandler.set('c', 3);
            assert.equal(this._sessionHandler.get('c'), 3);
            this._sessionHandler.save();

            break;
    }
};

SessionTester.prototype.testAsync = function(order, bis) {
    switch (order) {
        case '0':
            assert.equal(this._sessionHandler.get('a'), 1);

            break;
        case '1':
            assert.equal(this._sessionHandler.get('b'), undefined);

            break;
        case '2':
            this._sessionHandler.get('c');

            break;
        case '3':
            if (!bis) {
                this._sessionHandler.set('c', 4);
                this._sessionHandler.reload();
            } else {
                assert.equal(this._sessionHandler.get('c'), 3);
            }

            break;
    }
};

function CookieTester() {
}

CookieTester.prototype.test = function(order) {
    assert.equal(this._cookiesRegristry.get('foo'), undefined);
    this._cookiesRegristry.set('foo', 'bar');
    assert.equal(this._cookiesRegristry.get('foo'), 'bar');
    this._cookiesRegristry.unset('foo');
    assert.equal(this._cookiesRegristry.get('foo'), undefined);
};

module.exports = {
    config: {
        classes: {
            subrequestExecutor: SubrequestExecutor
        },
        services: {
            forumHandler: {
                class: ForumHandler
            },
            subrequestExecutor: {
                class: 'subrequestExecutor',
                properties: {
                    _router: '#danf:http.router#',
                    _route: '#danf:http.router[sub]#',
                    _event: '#danf:event.eventsContainer[request][sub]#'
                }
            },
            sessionTester: {
                class: SessionTester,
                properties: {
                    _sessionHandler: '#danf:http.sessionHandler#'
                }
            },
            cookieTester: {
                class: CookieTester,
                properties: {
                    _cookiesRegristry: '#danf:http.cookiesRegistry#'
                }
            }
        },
        sequences: {
            getForum: {
                operations: [
                    {
                        order: 0,
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(parameters, defaultPage) {
                                var topic = parameters.topic;

                                topic = topic.charAt(0).toUpperCase() + topic.slice(1);
                                parameters.topic = topic.charAt(0) + topic.slice(1).toLowerCase();

                                parameters.page = undefined !== parameters.page ? parameters.page : defaultPage;
                            },
                            '@.@',
                            '$main:defaultPage$'
                        ]
                    },
                    {
                        order: 1,
                        service: 'main:forumHandler',
                        method: 'getTopics',
                        arguments: ['@topic@'],
                        scope: 'topics'
                    },
                    {
                        order: 2,
                        service: 'main:forumHandler',
                        method: 'getMessages',
                        arguments: ['@topics.1@', '@page@'],
                        scope: 'messages'
                    },
                    {
                        order: 3,
                        service: 'main:forumHandler',
                        method: 'computeForumSize',
                        arguments: ['@topics@', '@messages@'],
                        scope: 'size'
                    },
                    {
                        order: 4,
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(parameters, title) {
                                parameters.count = parameters.messages.length;
                                parameters.title = title;
                            },
                            '@.@',
                            '$main:title$'
                        ]
                    }
                ]
            },
            increment: {
                operations: [
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(value) {
                                return value + 1;
                            },
                            '@number@'
                        ],
                        scope: 'number'
                    }
                ]
            },
            executeSubrequest: {
                operations: [
                    {
                        service: 'main:subrequestExecutor',
                        method: 'execute',
                        scope: 'text'
                    }
                ]
            },
            processForum: {
                operations: [
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(parameters, defaultPage) {
                                var topic = parameters.topic;

                                topic = topic.charAt(0).toUpperCase() + topic.slice(1);
                                parameters.topic = topic.charAt(0) + topic.slice(1).toLowerCase();

                                parameters.page = undefined !== parameters.page ? parameters.page : defaultPage;
                            },
                            '@.@',
                            '$main:defaultPage$'
                        ]
                    }
                ]
            },
            testSession: {
                operations: [
                    {
                        order: 0,
                        service: 'sessionTester',
                        method: 'test',
                        arguments: ['@order@']
                    },
                    {
                        order: 1,
                        service: 'sessionTester',
                        method: 'testAsync',
                        arguments: ['@order@']
                    },
                    {
                        order: 2,
                        service: 'sessionTester',
                        method: 'testAsync',
                        arguments: ['@order@', true]
                    }
                ]
            },
            testCookie: {
                operations: [
                    {
                        service: 'cookieTester',
                        method: 'test'
                    }
                ]
            },
            testInjection: {
                operations: [
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(a, b) {
                                return a + b;
                            },
                            '@a@',
                            '@b@'
                        ],
                        scope: 'c'
                    }
                ]
            },
            redirect: {
                operations: [
                    {
                        service: 'danf:http.redirector',
                        method: 'redirect',
                        arguments: ['/somewhere']
                    }
                ]
            }
        },
        events: {
            request: {
                getForum: {
                    path: '/api/forum',
                    headers: {
                        'X-Custom': 'ok'
                    },
                    methods: ['get', 'post'],
                    parameters: {
                        page: {
                            type: 'number',
                            default: 1
                        },
                        topic: {
                            type: 'string'
                        }
                    },
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/forum.jade'
                            }
                        },
                        json: {
                            value: {
                                messages: '@messages@'
                            }
                        }
                    },
                    sequences: [
                        {
                            name: 'getForum',
                            input: {
                                page: '@page@',
                                topic: '@topic@'
                            },
                            output: {
                                title: '@title@',
                                size: '@size@',
                                count: '@count@',
                                topics: '@topics@',
                                messages: '@messages@'
                            }
                        }
                    ]
                },
                param: {
                    path: '/param',
                    methods: ['post'],
                    parameters: {
                        number: {
                            type: 'number'
                        }
                    },
                    view: {
                        json: {
                            value: {
                                number: '@number@'
                            }
                        }
                    },
                    sequences: [
                        {
                            name: 'increment',
                            input: {
                                number: '@number@'
                            },
                            output: {
                                number: '@number@'
                            }
                        }
                    ]
                },
                stringParam: {
                    path: '/string-param',
                    methods: ['post'],
                    parameters: {
                        number: {
                            type: 'string'
                        }
                    },
                    view: {
                        json: {
                            value: {
                                number: '@number@'
                            }
                        }
                    },
                    sequences: [
                        {
                            name: 'increment',
                            input: {
                                number: '@number@'
                            },
                            output: {
                                number: '@number@'
                            }
                        }
                    ]
                },
                main: {
                    path: '/main',
                    methods: ['get'],
                    view: {
                        json: {
                            value: {
                                text: '@text@'
                            }
                        }
                    },
                    sequences: [
                        {
                            name: 'executeSubrequest',
                            output: {
                                text: '@text@'
                            }
                        }
                    ]
                },
                sub: {
                    path: '/sub',
                    methods: ['get'],
                    view: {
                        text: {
                            value: 'foo'
                        }
                    }
                },
                empty: {
                    path: '/empty',
                    methods: ['put']
                },
                session: {
                    path: '/session/:order',
                    methods: ['get'],
                    sequences: [
                        {
                            name: 'testSession',
                            input: {
                                order: '@order@'
                            }
                        }
                    ]
                },
                cookie: {
                    path: '/cookie',
                    methods: ['get'],
                    sequences: [
                        {
                            name: 'testCookie'
                        }
                    ]
                },
                injection: {
                    path: '/injection',
                    methods: ['get'],
                    parameters: {
                        a: {
                            type: 'string',
                            required: true
                        },
                        b: {
                            type: 'string',
                            required: true
                        }
                    },
                    sequences: [
                        {
                            name: 'testInjection',
                            input: {
                                a: '@a@',
                                b: '@b@'
                            },
                            output: {
                                c: '@c@'
                            }
                        }
                    ],
                    view: {
                        json: {
                            value: {
                                c: '@c@'
                            }
                        }
                    }
                },
                redirect: {
                    path: '/redirect',
                    methods: ['get'],
                    sequences: [
                        {
                            name: 'redirect'
                        }
                    ]
                }
            }
        },
        this: {
            defaultPage: 1,
            title: '@count@ messages (@count@/@size@kB) in the topic "@topics.1@"',
            capitalize: {
                callback: function(value) {
                    return value.charAt(0).toUpperCase() + value.slice(1);
                }
            }
        }
    },
    contract: {
        defaultPage: {
            type: 'number'
        },
        title: {
            type: 'string'
        },
        capitalize: {
            type: 'embedded',
            embed: {
                callback: {
                    type: 'function'
                }
            }
        }
    }
};