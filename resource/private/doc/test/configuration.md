Define the Configuration
========================

[←](index.md)

Application
-----------

### Define the configuration

There is many possible entry points in the conception of an application. Here, we are going to start from the configuration because it is a good way to understand the application we want to develop and it is the core of the framework.

```javascript
// lib/server/this.js

'use strict';

module.exports = {
    frameworks: ['danf', 'require', 'angular', 'meteor', 'jquery', 'mootools'],
    questions: {
        directory: __dirname + '/../../resources/private/question-scores',
        categories: {
            dumb: {
                mega: {
                    questions: {
                        color: 'In a world where blue is the only color, is blue your favorite color?',
                        choice: 'Yes or no?'
                    }
                },
                hyper: {
                    boost: 3,
                    questions: {
                        life: 'Do you understand why 42 is the answer to the ultimate question of life, the universe, and everything?'
                    }
                }
            },
            useless: {
                super: {
                    boost: 2,
                    questions: {
                        animals: 'Do you like animals?',
                        nanimals: 'Don\'t you like animals?'
                    }
                }
            }
        }
    }
};
```

We defined a list of available frameworks and a list of questions classified by category allowing to define a specific boost on each.
The user must answer yes or no to each of these questions and a corresponding score will be computed for each framework.

### Resolve the configuration

In order to avoid checking the format of this config in your code (possibly many times), you have to define a contract the config must respect.
Here is the corresponding contract for our config:

```javascript
// danf.js

'use strict';

var utils = require('-/danf/lib/utils');

module.exports = {
    dependencies: {
    },
    contract: {
        frameworks: {
            type: 'string_array'
        },
        questions: {
            type: 'embedded',
            embed: {
                directory: {
                    type: 'string'
                },
                categories: {
                    type: 'embedded',
                    embed: {
                        dumb: {
                            type: 'embedded_object',
                            embed: {
                                boost: {
                                    type: 'number',
                                    default: 1
                                },
                                questions: {
                                    type: 'string_object'
                                }
                            }
                        },
                        useless: {
                            type: 'embedded_object',
                            embed: {
                                boost: {
                                    type: 'number'
                                },
                                questions: {
                                    type: 'string_object'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    config: {
        // ...
    }
};
```

We will not talk about the detail of this contract but you have a full explanation in the documentation accessible [here](../use/configuration.md) or at the end of this page in the Navigation part.

Just a few words on the `dependencies` section you saw at the top of the file. Your application is also called "danf module". This means that you can use this application in another one just defining dependencies. We do not address this important topic here in order to keep this example simple but you should look at the documentation for more informations.

Navigation
----------

[Previous section](app.md) |
 [Next section](object.md)

[Documentation](../use/configuration.md)

[←](index.md)