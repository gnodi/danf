'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                request: {
                    home: {
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
                        sequences: [
                            {
                                name: 'generateRandom',
                                output: {
                                    random: '@random@'
                                }
                            }
                        ]
                    },
                    form: {
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
                        sequences: [
                            {
                                name: 'generateRandom',
                                output: {
                                    random: '@random@'
                                }
                            }
                        ]
                    },
                    a: {
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
                        sequences: [
                            {
                                name: 'getDate',
                                output: {
                                    date: '@date@'
                                }
                            },
                            {
                                name: 'generateRandom',
                                output: {
                                    random: '@random@'
                                }
                            }
                        ]
                    },
                    b: {
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
                        sequences: [
                            {
                                name: 'getDate',
                                output: {
                                    date: '@date@'
                                }
                            },
                            {
                                name: 'generateRandom',
                                output: {
                                    random: '@random@'
                                }
                            }
                        ]
                    },
                    c: {
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
                        sequences: [
                            {
                                name: 'getDate',
                                output: {
                                    date: '@date@'
                                }
                            },
                            {
                                name: 'generateRandom',
                                output: {
                                    random: '@random@'
                                }
                            }
                        ]
                    }
                }
            },
            sequences: {
                getDate: {
                    operations: [
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
                    ]
                },
                generateRandom: {
                    operations: [
                        {
                            service: 'danf:manipulation.callbackExecutor',
                            method: 'execute',
                            arguments: [
                                function() {
                                    return Math.floor(Math.random() * 10000);
                                }
                            ],
                            scope: 'random'
                        }
                    ]
                }
            }
        }
    },
    true
);