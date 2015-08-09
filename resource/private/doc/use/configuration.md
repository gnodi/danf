Define the Configuration
========================

[←](index.md)

Documentation
-------------

Danf provides a powerful configuration mechanism allowing to develop dynamic applications.

### Use another danf module as dependency

An application build with Danf is also called "danf module". This means that you can use this application in another one just defining dependencies.

```javascript
// danf.js

'use strict';

module.exports = {
    dependencies: {
        notification: require('notification/danf'),
        log: require('logger/danf')
    }
};
```

The `require` must be done on the file `danf.js` of the danf module.

### Define your own config

A module needs a way to define its own config in order to impact some of its behaviours dynamically.
Danf allows you to specify a contract that the config must respect.

#### Introduction example

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        size: {
            type: 'number'
        },
        terms: {
            type: 'string_array'
        }
    },
    config: {
        this: {
            size: 2,
            terms: ['condition1', 'condition2']
        }
    }
};
```

The contract applies to the config of the module. The config of the module is defined in `config.this`.
The rest of the example is straightforward enough to avoid any other explanation.

With the proto application this example becomes:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        size: {
            type: 'number'
        },
        terms: {
            type: 'string_array'
        }
    },
    config: {
        // ...
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    size: 2,
    terms: ['condition1', 'condition2']
};
```

#### Type

There is many available types helping you to easily check the format of your config:
* `number`: A number value.
* `string`: A string value.
* `boolean`: A boolean value.
* `function`: A function value.
* `date`: A Date value.
* `error`: An Error value.
* `undefined`: Undefined value.
* `null`: A null value.
* `free`: A totally free value.
* `number_array`: An array of number values.
* `string_array`: An array of string values.
* `boolean_array`: An array of boolean values.
* `function_array`: An array of function values.
* `date_array`: An array of Date values.
* `error_array`: An array of Error values.
* `free_array`: An array of free values.
* `number_object`: An object of number properties.
* `string_object`: An object of string properties.
* `boolean_object`: An object of boolean properties.
* `function_object`: An object of function properties.
* `date_object`: An object of Date properties.
* `error_object`: An object of Error properties.
* `free_object`: An object of free properties.
* `number_array_array`: An array of arrays of number values.
* `string_array_array`: An array of arrays of string values.
* `boolean_array_array`: An array of arrays of boolean values.
* `free_array_array`: An array of arrays of free values.
* `number_array_object`: An object of arrays of number properties.
* `string_array_object`: An object of arrays of string properties.
* `boolean_array_object`: An object of arrays of boolean properties.
* `free_array_object`: An object of arrays of free properties.
* `embedded`: An embedded object with defined names for its properties.
* `embedded_array`: An array of embedded object with defined names for their properties.
* `embedded_object`: An object of embedded object with defined names for their properties.
* `function() {}`: An interpreted callback.

##### Simple

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: 2
};
```

Other types with the same behaviour:
* `string`
* `boolean`
* `function`
* `date`
* `error`
* `undefined`
* `null`
* `free`

##### *_array

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_array'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: [2, 3, 5]
};
```

Other types with the same behaviour:
* `string_array`
* `boolean_array`
* `function_array`
* `date_array`
* `error_array`
* `free_array`

##### *_object

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: {
        foo: 2,
        bar: 3
    }
};
```

Other types with the same behaviour:
* `string_object`
* `boolean_object`
* `function_object`
* `date_object`
* `error_object`
* `free_object`

##### *_array_array

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_array_array'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: [
        [0, 2],
        [2, 3],
        [1]
    ]
};
```

Other types with the same behaviour:
* `string_array_array`
* `boolean_array_array`
* `function_array_array`
* `date_array_array`
* `error_array_array`
* `free_array_array`

##### *_array_object

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_array_object'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: {
        foo: [2],
        bar: [3, 10]
    }
};
```

Other types with the same behaviour:
* `string_array_object`
* `boolean_array_object`
* `function_array_object`
* `date_array_object`
* `error_array_object`
* `free_array_object`

##### *_object_array

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object_array'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: [
        {foo: 2},
        {foo: 3, bar: 10}
    ]
};
```

Other types with the same behaviour:
* `string_object_array`
* `boolean_object_array`
* `function_object_array`
* `date_object_array`
* `error_object_array`
* `free_object_array`

##### *_object_object

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object_object'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: {
        foo: {foo: 2},
        bar: {foo: 3, bar: 10}
    }
};
```

Other types with the same behaviour:
* `string_object_object`
* `boolean_object_object`
* `function_object_object`
* `date_object_object`
* `error_object_object`
* `free_object_object`

##### Embedded

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'embedded',
            embed: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'string'
                }
            }
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: {
        foo: 1,
        bar: 'foo'
    }
};
```

##### Embedded array

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'embedded_array',
            embed: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'string'
                }
            }
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: [
        {
            foo: 1,
            bar: 'foo'
        },
        {
            foo: 4,
            bar: 'bar'
        {
    ]
};
```

##### Embedded object

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'embedded_object',
            embed: {
                foo: {
                    type: 'number'
                },
                bar: {
                    type: 'string'
                }
            }
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: {
        foo: {
            foo: 1,
            bar: 'foo'
        },
        bar: {
            foo: 4,
            bar: 'bar'
        }
    }
};
```

##### Callback

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: function(value) {
                if (value <= 1) {
                    // OK.
                    return;
                } else if (value >= 3) {
                    // OK.
                    return true;
                }

                // KO.
                return 'the value must be 2';
            }
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: 2
};
```

##### Multitypes

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number|string'
        }
    }
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: 2
};
```

```javascript
// config/server/this.js

'use strict';

module.exports = {
    field: 'plop'
};
```

##### Interpretation

Notice that some values can be interpreted:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        number: {
            type: 'number'
        },
        boolean: {
            type: 'boolean'
        }
    }
};
```

Config:

```javascript
{
    number: '1',
    boolean: '1'
}
```

will result in:

```javascript
{
    number: 1,
    boolean: true
}
```

#### Required

`required` forces the definition of the field:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number',
            required: true
        }
    }
};
```

By default `required = false`.

#### Default

`default` allows to specify a default value if the field is not defined:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number',
            default: 0
        }
    }
};
```

Config:

```javascript
{}
```

will result in:

```javascript
{field: 0}
```

The value must be of the defined type.

#### Flatten

Flatten allow to flatten a field:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object',
            flatten: true
        }
    }
};
```

Config:

```javascript
{
    field: {
        foo: {
            bar: 2
        },
        bar: {
            foo: {
                bar: 1
            }
        }
    }
}
```

will result in:

```javascript
{
    field: {
        'foo.bar': 2,
        'bar.foo.bar': 1
    }
}
```

You can specify the separator instead of `true` (`flatten: ';'`)
The flattened value should be of the defined type.

#### Namespace

Namespace prefixes your field with the namespace of its owner module:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object',
            namespace: true
        }
    }
};
```

Config:

```javascript
{
    field: {
        foo: 1,
        bar: 4
    }
}
```

will result in:

```javascript
{
    field: {
        'main:foo': 1,
        'main:bar': 4
    }
}
```

It is a good way to avoid naming collisions between danf modules.

#### References

References defines the references which should be prefixed with the namespace of theirs owner module:

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        field: {
            type: 'number_object',
            references: ['#', '$']
        }
    }
};
```

Config:

```javascript
{
    field: {
        foo: 'hello $world$!',
        bar: #bar#
    }
}
```

will result in:

```javascript
{
    field: {
        foo: 'hello $main:world$!',
        bar: #main:bar#
    }
}
```

References `%...%` are automaticaly prefixed.

#### Advanced example

```javascript
// danf.js

module.exports = {
    contract: {
        providers: {
            type: 'embedded_object',
            embed: {
                codes: {
                    type: 'number_array'
                },
                active: {
                    type: 'boolean',
                    default: false
                },
                rules: {
                    type: 'embedded_array',
                    embed: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        params: {
                            type: 'free'
                        }
                    }
                }
            }
        },
        size: {
            type: 'number',
        },
        terms: {
            type: 'string_array'
        },
        properties: {
            type: 'free_object'
        },
        methods: {
            type: 'number_array_object'
        }
    },
    config: {
        this: {
            providers: {
                images: {
                    codes: [123, 256],
                    active: true,
                    rules: [
                        {
                            name: 'size',
                            params: {
                                min: 2,
                                max: 3
                            }
                        },
                        {
                            name: 'existence',
                            params: null
                        }
                    ]
                },
                videos: {
                    codes: [],
                    active: false,
                    rules: [
                        {
                            name: 'type',
                            params: 'mpeg'
                        }
                    ]
                },
                big_images: {
                    codes: [123, 256],
                    active: true,
                    rules: [
                        {
                            name: 'size',
                            params: {
                                min: 4
                            }
                        }, {
                            name: 'existence',
                            params: null
                        }
                    ]
                }
            },
            size: 4,
            terms: [
                'condition1',
                'condition2',
                'condition3'
            ],
            properties: {
                backgroundColor: { r: 50, g: 100, b: 150 },
                width: 1920,
                height: 1080
            },
            methods: {
                setBlue: [0, 0, 255],
                setYellow: [255, 255, 0]
            }
        }
    }
};
```

### Override the config of dependencies

You can override the config of a submodule dependency in this way:

```javascript
// mod1/danf.js

'use strict';

module.exports = {
    contract: {
        width: {
            type: 'number'
        },
        height: {
            type: 'number'
        }
    },
    config: {
        this: {
            width: 2,
            height: 4
        }
    }
};
```

```javascript
// danf.js

'use strict';

module.exports = {
    dependencies: {
        mod1: require('./mod1/danf')
    },
    contract: {
    },
    config: {
        this: {
        },
        mod1: {
            width: 3
        }
    }
};
```

The resulting config is:

```javascript
{
    width: 3,
    height: 4
}
```

### Force version of a dependency

Sometimes, you can have dependencies with an indentical dependency. You could then decide to merge this dependencies.
It is a bit complicated, but let's see an example:

```javascript
// danf.js

'use strict';

module.exports = {
    dependencies: {
        mod1: require('./mod1/danf'),
        mod2: require('./mod2/danf')
    }
};
```

```javascript
// mod1/danf.js

'use strict';

module.exports = {
    dependencies: {
        mod10: require('./mod1/danf')
    }
};
```

```javascript
// mod2/danf.js

'use strict';

module.exports = {
    dependencies: {
        mod10: require('./mod10/danf')
    }
};
```

```javascript
// mod1/mod10/danf.js

'use strict';

module.exports = {
};
```

```javascript
// mod2/mod10/danf.js

'use strict';

module.exports = {
};
```

You will have a `mod1.mod10` and a `mod2.mod10` submodules whereas you certainly want only one of the two.
You can force the use of only one in this way:

```javascript
// danf.js

'use strict';

module.exports = {
    dependencies: {
        mod1: require('./mod1/danf'),
        mod2: require('./mod2/danf'),
        'mod2.mod10': 'mod1.mod10'
    }
};
```

This means that, instead of using its own dependency, `mod2` will use `mod1` one's for `mod10` dependency.
It is not a default behaviour because it could lead to problems with the version of Node's modules.
However, you will certainly need this feature if you use the dependency injection in order to ensure scope for services.

Of course, you can override the config of the dependency of your own dependencies:

```javascript
// danf.js

'use strict';

module.exports = {
    dependencies: {
        mod1: require('./mod1/danf'),
        mod2: require('./mod2/danf')
    },
    config: {
        'mod1.mod10': {
            // ...
        }
    }
};
```

### Define config for a specific environment

```javascript
// danf.js

'use strict';

module.exports = {
    contract: {
        debug: {
            type: 'boolean'
        }
    },
    config: {
        this: {
            debug: true;
        },
        'this/prod': {
            debug: false;
        }
    }
};
```

The config for an environment overrides the standard config. Here, in a `prod` environment, the resulting config will be `debug: false` whereas in the others it will be `debug: true`.

### Factorize config

You can factorize your configuration using parameters:

```javascript
// config/server/this.js

'use strict';

module.exports = {
    roles: {
        admin: %users.lana%,
        moderator: %users.tom%,
        contact: %users.tom%
    }
};
```

`@users.lana@` is a reference to a parameter:

```javascript
// config/server/parameters.js

'use strict';

module.exports = {
    users: {
        tom: {
            name: tom,
            email: tom-@danf.com
        },
        lana: {
            name: lana,
            email: lana-@danf.com
        }
    }
};
```

The resulting config of the interpretation of these references will be:

```javascript
roles: {
    admin: {
        name: lana,
        email: lana-@danf.com
    },
    moderator: {
        name: tom,
        email: tom-@danf.com
    },
    contact: {
        name: tom,
        email: tom-@danf.com
    }
};
```

### Use references

References are a powerful tool used by the config. A reference works as a kind of selector on a context. There are many types of references used in Danf in many places. The parameters are one of these types. `%` is the delimiter of this type (this delimiter can change for another type) and the context is the list of configured parameters. The references of the parameters are interpreted before anything else occurs on the config. This is why you can factorize configuration with it. The interpretation of a type of references can be made at any time (even runtime) by any classes.

Let's see some examples to understand how works the references:

```javascript
// Source
'%foo.bar%'
// Context
{foo: { bar: 'ok' }}
// Result of the interpretation
'ok'
```

```javascript
// Source
'I love %who%',
// Context
{who: 'you'},
// Result of the interpretation
'I love you'
```

```javascript
// Source
'I love %who%',
// Context
{who: ['you', 'me']},
// Result of the interpretation
['I love you', 'I love me']
```

```javascript
// Source
'I love %who%',
// Context
{
    who: {
        you: 'Johna Doe',
        me: 'John Doe'
    }
},
// Result of the interpretation
['I love Johna Doe', 'I love John Doe']
```

```javascript
// Source
'I love %who%',
// Context
{
    who: {
        you: {name: 'Johna Doe'},
        me: {name: 'John Doe'}
    }
},
// Result of the interpretation
['I love you', 'I love me']
```

```javascript
// Source
'%who%',
// Context
{
    who: {
        you: 'Johna Doe',
        me: 'John Doe'
    }
},
// Result of the interpretation
{you: 'Johna Doe', me: 'John Doe'}
```

By default references are linked together:

```javascript
// Source
'%who.man% loves %who.woman%',
// Context
{
    who: [
        {
            man: 'Brad',
            woman: 'Angelina'
        },
        {
            man: 'Bobby',
            woman: 'Bob'
        }
    ]
},
// Result of the interpretation
['Brad loves Angelina', 'Bobby loves Bob']
```

```javascript
// Source
'%who.man% loves %who.woman%',
// Context
{
    who: {
        Smith: {
            man: 'Brad',
            woman: 'Angelina'
        },
        Booble: {
            man: 'Bobby',
            woman: 'Bob'
        }
    }
},
// Result of the interpretation
['Brad loves Angelina', 'Bobby loves Bob']
```

```javascript
// Source
'%who.Smith.man% loves %who.Smith.woman%',
// Context
{
    who: {
        Smith: {
            man: 'Brad',
            woman: 'Angelina'
        },
        Booble: {
            man: 'Bobby',
            woman: 'Bob'
        }
    }
},
// Result of the interpretation
'Brad loves Angelina'
```

You can add `` in a reference to tell that it is independent of the others:

```javascript
// Source
'%`who.man`% loves %`who.woman`%',
// Context
{
    who: {
        Smith: {
            man: 'Brad',
            woman: 'Angelina'
        },
        Booble: {
            man: 'Bobby',
            woman: 'Bob'
        }
    }
},
// Result of the interpretation
[
    'Brad loves Angelina',
    'Bobby loves Angelina',
    'Brad loves Bob',
    'Bobby loves Bob'
]
```

```javascript
// Source
'%`who.man`% loves %who.woman% who loves %who.man%',
// Context
{
    who: {
        Smith: {
            man: 'Brad',
            woman: 'Angelina'
        },
        Booble: {
            man: 'Bobby',
            woman: 'Bob'
        }
    }
},
// Result of the interpretation
[
    'Brad loves Angelina who loves Brad',
    'Brad loves Bob who loves Bobby',
    'Bobby loves Angelina who loves Brad',
    'Bobby loves Bob who loves Bobby'
]
```

```javascript
// Source
'%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
// Context
{
    who: {
        name: {
            first: 'John',
            last: 'Doe'
        },
        age: 25,
        cities: ['Paris', 'New York']
    }
},
// Result of the interpretation
[
    'John Doe is 25 and lives in Paris',
    'John Doe is 25 and lives in New York'
]
```

```javascript
// Source
'%who.names% is %who.ages% and lives in %who.city%',
// Context
{
    who: {
        names: ['John', 'Bobby'],
        ages: [20, 25],
        city: 'Paris'
    }
},
// Result of the interpretation
[
    'John is 20 and lives in Paris',
    'John is 25 and lives in Paris',
    'Bobby is 20 and lives in Paris',
    'Bobby is 25 and lives in Paris'
]
```

```javascript
// Source
'%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
// Context
{
    who: [
        {
            name: {
                first: 'John',
                last: 'Doe'
            },
            age: 25,
            cities: ['Paris', 'New York']
        },
        {
            name: {
                first: 'Bobby',
                last: 'Bob'
            },
            age: 28,
            cities: ['Houston']
        },
    ]
},
// Result of the interpretation
[
    'John Doe is 25 and lives in Paris',
    'John Doe is 25 and lives in New York',
    'Bobby Bob is 28 and lives in Houston'
]
```

```javascript
// Source
'%main.a% is %main.d.f% in %main.b% for %main.d.e%',
// Context
{
    main: [
        {
            a: '?',
            b: ['plop', 'plip'],
            c: ['plap'],
            d: [
                {
                    e: 'me',
                    f: ['here', 'now']
                },
                {
                    e: 'you',
                    f: ['home']
                }
            ]
        },
        {
            a: '!',
            b: ['plup'],
            c: [],
            d: [
                {
                    e: 'anybody',
                    f: ['nowhere']
                }
            ]
        }
    ]
},
// Result of the interpretation
[
    '? is here in plop for me',
    '? is here in plip for me',
    '? is now in plop for me',
    '? is now in plip for me',
    '? is home in plop for you',
    '? is home in plip for you',
    '! is nowhere in plup for anybody'
]
```

### Use the config

You will see in the next sections how to use this config.

Navigation
----------

[Previous section](app.md) |
 [Next section](object.md)

[Application](../test/configuration.md)

[←](index.md)