Configuration
=============

[←](../index.md)

Documentation
-------------

Danf provides a powerful configuration mechanism allowing you to develop dynamic applications. It is used to define the events, the sequences, the dependency injection, ... This section is a bit long but configuration is the base to correctly understand all other parts.

### Dependencies

In Danf, an application is also a **danf module**. A danf module can use other danf modules as dependencies. A danf module can use dependencies of its dependencies...

Dependencies are automatically detected. All you have to do is to set the dependency in your file `package.json` as for any other node.js dependency:

```json
{
    ...
    "dependencies": {
        ...
        "danf-gnodi-mongo": "~1.0"
    }
}
```

*Do not forget to process a `npm install`.*

### Contract

A good configuration mechanism always provides a way to check the format of this configuration. In Danf, you can use a 'contract' to do that.

#### Define a contract

Imagine you want to specify to check the validity of the following data:

```javascript
{
    foo: [2, 11, 5],
    bar: 'foo'
}
```

Here is the corresponding contract:

```javascript
{
    foo: {
        type: 'number_array'
    },
    bar: {
        type: 'string'
    }
}
```

#### Define the contract of the module config

Each danf module can define a contract for its own config:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    foo: {
        type: 'number_array'
    },
    bar: {
        type: 'string'
    }
};
```

Then, you can define your corresponding config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    foo: [2, 11, 5],
    bar: 'foo'
};
```

A bad config like:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    foo: [2, 11, 5],
    bar: 4
};
```

will throw an error with the following explicit message:

```
The expected value for "main:config.bar" is a "string"; a "number" of value `4` given instead.
```

As you can see this config has been defined in the folder `config/common`. This means that it will be available for both client and server sides. You can override this config on one side with:

```javascript
// config/server/contract.js

'use strict';

module.exports = {
    bar: {
        type: 'number'
    }
};
```

This will result in the config on the server side:

```javascript
{
    foo: {
        type: 'number_array'
    },
    bar: {
        type: 'number'
    }
}
```

#### Override a dependency config

Here is the configuration of the dependency `foo`:

```javascript
// node_modules/foo/config/common/config/this.js

'use strict';

module.exports = {
    size: 1
};
```

Here is the configuration of the dependency `bar` of `foo`:

```javascript
// node_modules/foo/node_modules/bar/config/common/config/this.js

'use strict';

module.exports = {
    size: {
        width: 3,
        height: 2
    }
};
```

`foo` can override the config of `bar` thanks to:

```javascript
// node_modules/foo/config/common/config/bar.js

'use strict';

module.exports = {
    size: {
        width: 4
    }
};
```

Your module can override the config of `foo` thanks to:

```javascript
// config/common/config/foo.js

'use strict';

module.exports = {
    size: 5
};
```

Your module can override the config of `bar` thanks to:

```javascript
// config/common/config/foo:bar.js

'use strict';

module.exports = {
    size: {
        height: 6
    }
};
```

The config is built from logical directory tree structure. For instance, if you take the previously defined file `config/common/config/foo:bar.js`, the generated config will be:

```javascript
{
    config: {
        'foo:bar': {
            size: {
                height: 6
            }
        }
    }
}
```

> Each dependency has a contextual namespace in its anchestor modules:
> - The namespace of `bar` seen by `foo` is `bar:`.
> - The namespace of `foo` seen by your module is `foo:`.
> - The namespace of `bar` seen by your module is `foo:bar:`.
> - The absolute namespace of your module is 'main:'.
> - The absolute namespace of `bar` is `main:foo:bar:`.

#### Use the contract attributes

##### Type

Attribute `type` allows to check the type of a field.
There are many available types helping you to easily check the format of your config:
- `number`: A number value.
- `string`: A string value.
- `boolean`: A boolean value.
- `function`: A function value.
- `date`: A Date value.
- `regexp`: A RegExp value.
- `error`: An Error value.
- `undefined`: Undefined value.
- `null`: A null value.
- `free`: A totally free value.
- `array`: An array of values.
- `*_array`: An array of * values.
- `object`: An array with properties.
- `*_object`: An array with * properties.
- `*_array_array`: An array of arrays of * values.
- `*_array_object`: An object with arrays of * values.
- `*_object_array`: An array of object with * properties.
- `*_object_object`: An object with objects with * properties.
- `embedded`: An embedded object with defined names for its properties.
- `embedded_array`: An array of embedded object with defined names for their properties.
- `embedded_object`: An object of embedded object with defined names for their properties.

**Simple**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: 2
};
```

***_array**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_array'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: [2, 3, 5]
};
```

***_object*

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: {
        foo: 2,
        bar: 3
    }
};
```

***_array_array**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_array_array'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: [
        [0, 2],
        [2, 3],
        [1]
    ]
};
```

***_array_object**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_array_object'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: {
        foo: [2],
        bar: [3, 10]
    }
};
```

***_object_array**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object_array'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: [
        {foo: 2},
        {foo: 3, bar: 10}
    ]
};
```

***_object_object**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object_object'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: {
        foo: {foo: 2},
        bar: {foo: 3, bar: 10}
    }
};
```

**Embedded**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
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
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: {
        foo: 1,
        bar: 'foo'
    }
};
```

**Embedded array**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
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
};
```

```javascript
// config/common/config/this.js

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

**Embedded object**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
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
};
```

```javascript
// config/common/config/this.js

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

**Multitypes**

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number|string'
    }
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: 2
};
```

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: 'plop'
};
```

**Interpretation**

Notice that some values can be interpreted:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    number: {
        type: 'number'
    },
    boolean: {
        type: 'boolean'
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
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

##### Format

Attribut `format` allows you to format the data. It occurs before the type check during the merging phase and the validation phase.

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        format: function(value) {
            if (!Array.isArray(value)) {
                return [value];
            }
        },
        type: 'number_array'
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: 2
};
```

will result in the interpreted config:

```javascript
{
    field: [2]
}
```

##### Validate

Attribute `validate` allows you to format and validate the data. It occurs after the type check only at the validation phase.

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number',
        validate: function(value) {
            if (1 < value) {
                throw new Error('an "integer lower than or equal to 1"');
            }
        }
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    field: 2
};
```

will throw an error with the following message:

```
The expected value for "main:config.field" is an "integer lower than or equal to 1"; a "number" of value `2` given instead.
```

> Validate can return a formatted value.

##### Required

Attribute `required` forces the definition of the field:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number',
        required: true
    }
};
```

By default `required = false`.

##### Default

Attribute `default` allows to specify a default value if the field is not defined:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number',
        default: 0
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
};
```

will result in:

```javascript
{field: 0}
```

The value must be of the defined type.

##### Flatten

Attribute `flatten` allow to flatten a field:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object',
        flatten: true
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
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
};
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

##### Namespace

Attribute `namespace` prefixes your field with the namespace of its owner module:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object',
        namespace: true
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
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

##### References

Attribute `references` defines the references which should be prefixed with the namespace of theirs owner module:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
    field: {
        type: 'number_object',
        references: ['#', '$']
    }
};
```

Config:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
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

> A chapter explaining references is available below.

#### See an advanced example

Here is a complex contract:

```javascript
// config/common/contract.js

'use strict';

module.exports = {
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
};
```

Here is a config respecting this contract:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
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
};
```

#### Factorize config

You can factorize your configuration using parameters:

```javascript
// config/common/config/this.js

'use strict';

module.exports = {
    roles: {
        admin: '%users.lana%',
        moderator: '%users.tom%',
        contact: '%users.tom%'
    }
};
```

`@users.lana@` is a reference to a parameter:

```javascript
// config/common/config/parameters.js

'use strict';

module.exports = {
    users: {
        tom: {
            name: 'tom',
            email: 'tom-@danf.com'
        },
        lana: {
            name: 'lana',
            email: 'lana-@danf.com'
        }
    }
};
```

The resulting config of the interpretation of these references will be:

```javascript
roles: {
    admin: {
        name: 'lana',
        email: 'lana-@danf.com'
    },
    moderator: {
        name: 'tom',
        email: 'tom-@danf.com'
    },
    contact: {
        name: 'tom',
        email: 'tom-@danf.com'
    }
};
```

### References

References are a powerful tool used by the config. A reference works as a kind of selector on a context. There are many types of references used in Danf in many places. The parameters are one of these types. `%` is the delimiter of this type (this delimiter can change for another type) and the context is the list of configured parameters. The references of the parameters are interpreted before anything else occurs on the config. This is why you can factorize configuration with it. The interpretation of a type of references can be made at any time (even runtime) by any classes.

Let's see some examples to understand how works the references:

```javascript
// Source
'%foo.bar%'
// Context
{foo: {bar: 'ok'}}
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

Navigation
----------

| [OOP >](oop.md)

[←](../index.md)
