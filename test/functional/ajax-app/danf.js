'use strict';

module.exports = {
    config: {
        events: {
            request: {
                home: {
                    path: '',
                    methods: ['get'],
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    },
                    sequences: ['generateRandom']
                },
                form: {
                    path: '/form',
                    methods: ['get'],
                    parameters: {
                        name: {
                            type: 'string',
                            default: ''
                        }
                    },
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/form.jade'
                            }
                        }
                    },
                    sequences: ['generateRandom']
                },
                a: {
                    path: '/a/:number',
                    methods: ['get'],
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/a.jade',
                                embed: {
                                    date: {
                                        file: __dirname + '/date.jade',
                                    }
                                }
                            }
                        }
                    },
                    sequences: ['getDate', 'generateRandom']
                },
                b: {
                    path: '/b/:number',
                    methods: ['get'],
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/b.jade',
                                embed: {
                                    date: {
                                        file: __dirname + '/date.jade',
                                    }
                                }
                            }
                        }
                    },
                    sequences: ['getDate']
                },
                c: {
                    path: '/c/:number',
                    methods: ['get'],
                    view: {
                        html: {
                            layout: {
                                file: __dirname + '/layout.jade'
                            },
                            body: {
                                file: __dirname + '/c.jade',
                                embed: {
                                    date: {
                                        file: __dirname + '/date.jade',
                                    }
                                }
                            }
                        }
                    },
                    sequences: ['getDate']
                }
            }
        },
        sequences: {
            getDate: [
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(parameters) {
                            var date = new Date();

                            parameters.date = date.toLocaleTimeString();
                        },
                        '@.@'
                    ]
                }
            ],
            generateRandom: [
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function() {
                            return Math.floor(Math.random() * 10000);
                        }
                    ],
                    returns: 'random'
                }
            ]
        },
        assets: {
            '-/danf': __dirname + '/danf-client'
        }
    }
};