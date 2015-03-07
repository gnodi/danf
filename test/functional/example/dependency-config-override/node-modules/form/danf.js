'use strict';

module.exports = {
    contract: {
        form: {
            type: 'embedded_object',
            embed: {
                labels: {
                    type: 'string_object'
                }
            }
        }
    },
    config: {
        this: {
            form: {
                login: {
                    labels: {
                        login: 'Login',
                        password: 'Password'
                    }
                }
            }
        },
        sequences: {
            getLoginLabels: [
                {
                    // Danf's service allowing to execute a callback.
                    // Just use it for tests.
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(form) {
                            if (form.login) {
                                return form.login.labels;
                            }

                            return {
                                login: 'login',
                                password: 'password'
                            }
                        },
                        '$form$'
                    ],
                    returns: 'labels'
                }
            ]
        }
    }
};