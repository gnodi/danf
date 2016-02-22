'use strict';

module.exports = {
    server: {
        configuration: {
            config: {
                sequences: {
                    concat: {
                        operations: [
                            {
                                condition: function(stream) {
                                    return stream.foobar;
                                },
                                service: 'danf:manipulation.callbackExecutor',
                                method: 'execute',
                                arguments: [
                                    function(_, foo, bar) {
                                        var sum = 0;

                                        for (var i = 0; i < bar.length; i++) {
                                            sum += bar[i];
                                        }

                                        console.log('{0} {1} {2}'.format(
                                            _.join(' '),
                                            foo,
                                            sum
                                        ));
                                    },
                                    '@_@',
                                    '@foo@',
                                    '@bar@'
                                ]
                            }
                        ]
                    }
                },
                events: {
                    command: {
                        test: {
                            options: {
                                foo: {
                                    type: 'string',
                                    required: true
                                },
                                bar: {
                                    type: 'number_array',
                                    required: true
                                },
                                foobar: {
                                    type: 'boolean',
                                    required: true
                                }
                            },
                            sequences: [
                                {
                                    name: 'concat',
                                    input: {
                                        _: '@_@',
                                        foo: '@foo@',
                                        bar: '@bar@',
                                        foobar: '@foobar@'
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        context: {environment: 'test', verbosity: 0, cluster: null}
    },
    client: {
        configuration: 'auto',
        context: {}
    }
};