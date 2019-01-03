# Danf
**Danf** is a powerful but simple and lightweight lib helping you to code in a more [declarative way](http://latentflip.com/imperative-vs-declarative) and to enhance [low coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between your components thanks to [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection).

Here is the promises:
- less and dynamic dependencies: **more scalability**
- identifiable dependencies: **more maintainability** (duck typing, specific value validation, ...)
- injected dependencies: **easier testing** (automatic isolation, straightforward validated mocks, ...)
- easier to understand code: **more all** (encourage declarative code with configuration)

> **Danf** can be used both client and server sides.

In fact, **Danf** is an abstraction layer proposing an easy and fast way to use [nead](https://github.com/gnodi/nead) dependency injection.

[![Build][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Version][version-image]][version-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

## Summary
- [Installation](#installation)
- [Big promise](#big-promise)
  - [Without Danf](#without-danf)
  - [With Danf](#with-danf)
- [Use](#use)
  - [Define danf configuration file](#define-danf-configuration-file)
    - [danf.set](#danf-set)
  - [Define danf composition file](#define-danf-composition-file)
    - [danf.compose](#danf-compose)
  - [Build dependency injection container](#build-dependency-injection-container)
    - [danf.build](#build-dependency-injection-container)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation
Run the following command to add the package to your dependencies:
```sh
$ npm install --save danf
```

## Big promise
Let's illustrate promises with a classic example: an import app.

We want to import some remote resources and persist them in different systems.
The import consists in 3 steps:
- fetching
- parsing
- persistence

The common part with or without Danf is defining:
- some fetchers (`restApi`, `file`, ...).
- some parsers (`json`, `xml`, `csv`, ...).
- some persister (`mysql`, `mongodb`, `file`, ...).

### Without Danf
Here is a classic and trivial way to implement import:
```js
// src/importer.js

const fetchers = require('./fetchers');
const parsers = require('./parsers');
const persisters = require('./persisters');

class Importer {
  async importOne(fetcherId, fetcherOptions, parserId, parserOptions, persisterId, persisterOptions) {
    const fetchedData = await fetchers[fetcherId].fetch(fetcherOptions);
    const parsedData = await parsers[parserId].parse(fetchedData, parserOptions);
    return persisters[persisterId].persist(parsedData, persisterOptions);
  }
}
```

Here is the code to import your data:

```js
// index.js

const importer = require('./src/importer');

// First import.
importer.importOne(
  'apiRest',
  {endpoint: 'http://...'},
  'json',
  {},
  'mysql',
  {dsn: 'mysql:...'}
);

// Second import.
importer.importOne(
  'file',
  {dir: '/var/source/...'},
  'csv',
  {columns: ['foo', 'bar']},
  'file',
  {dsn: 'var/destination/...'}
);

// ...
```

This code has several problems:
- if a fetcher (or parser or persister) id does not exist, a not explicit error will be thrown (if no code is made to check it)
- adding a fetcher (or parser or persister) from an external source is tricky (even more if you use ES6 modules instead of CommonJS)
- code defining and processing all imports is a bit redundant and imperative
- if you want to unit test importer, you have to use a specific lib to override internal requires (not avoiding you to load original requires)

### With Danf
The code of the importer becomes:
```js
// src/importer.js

// No more "require" (low coupling!).

class Importer {
  // Define needed dependencies.
  get need() {
    return {
      fetcherRegistry: {
        proxy: 'registry',
        // Duck typing!
        interface: {
          methods: ['fetch']
        }
      },
      parserRegistry: {
        proxy: 'registry',
        interface: {
          methods: ['parse']
        }
      },
      persisterRegistry: {
        proxy: 'registry',
        interface: {
          methods: ['persist']
        }
      },
      importDefinitions: {
        // Value validation schema (felv).
        value: {
          type: Array
        }
      }
    }
  }

  async importOne(fetcherId, fetcherOptions, parserId, parserOptions, persisterId, persisterOptions) {
    // The fetchers are now accessible from an object property which is a registry abstraction
    // checking that id exists and throwing an explicit error if not.
    const fetchedData = await this.fetcherRegistry.get(fetcherId).fetch(fetcherOptions);
    const parsedData = await this.parserRegistry.get(parserId).parse(fetchedData, parserOptions);
    return this.persisterRegistry.get(persisterId).persist(parsedData, persisterOptions);
  }

  // We added an "importAll" method allowing to execute many imports at once
  // using "importDefinitions" property.
  importAll() {
    return Promise.all(this.importDefinitions.map((definition) => importOne(
      definition.fetcher.id,
      definition.fetcher.options,
      definition.parser.id,
      definition.parser.options,
      definition.persister.id,
      definition.persister.options
    ))]);
  }
}
```

First, you have to write your dependency injection configuration corresponding to your definition of needed dependencies:
```js
// config/services.js

const fetchers = require('../src/fetchers');
const parsers = require('../src/parsers');
const persisters = require('../src/persisters');

module.exports = (danf) => ({
  // Define fetcherRegistry service containing all fetchers.
  fetcher: {
    factory: 'set',
    items: danf.set(fetchers),
    registry: 'fetcherRegistry'
  },
  parser: {
    factory: 'set',
    items: danf.set(parsers),
    registry: 'parserRegistry'
  },
  persister: {
    factory: 'set',
    items: danf.set(persisters),
    registry: 'persisterRegistry'
  },
  importer: {
    factory: 'service',
    // Inject registries and import definitions as importer dependencies.
    dependencies: {
      fetcherRegistry: '#fetcherRegistry',
      parserRegistry: '#parserRegistry',
      persisterRegistry: '#persisterRegistry',
      importDefinitions: '#config.imports'
    }
  }
});
```

You can use several files to segregate concepts. Here is, for instance, the import configuration in its own place:
```js
// config/config.js

module.exports = (danf) => ({
  config: {
    factory: 'data',
    data: {
      // Define imports configuration.
      imports: [
        // First import.
        {
          fetcher: {
            id: 'apiRest',
            options: {endpoint: 'http://...'}
          }
          parser: {
            id: 'json'
          }
          persister: {
            id: 'mysql',
            options: {dsn: 'mysql:...'}
          }
        },
        // Second import.
        {
          fetcher: {
            id: 'file',
            options: {dir: '/var/source/...'}
          }
          parser: {
            id: 'csv',
            options: {columns: ['foo', 'bar']}
          }
          persister: {
            id: 'file',
            options: {dsn: 'var/destination/...'}
          }
        }
      ]
    },
    schema: {
      // Define validation schema for imports configuration (felv).
      imports: {
        type: Array,
        items: {
          type: Object,
          properties: {
            fetcher: {
              type: Object,
              properties: {
                id: {
                  type: 'string'
                },
                options: {
                  type: Object,
                  default: {}
                }
              }
            },
            parser: {
              type: Object,
              properties: {
                id: {
                  type: 'string'
                },
                options: {
                  type: Object,
                  default: {}
                }
              }
            },
            persister: {
              type: Object,
              properties: {
                id: {
                  type: 'string'
                },
                options: {
                  type: Object,
                  default: {}
                }
              }
            }
          }
        }
      }
    }
  }
});
```

Then, tell Danf where to find your [nead](https://github.com/gnodi/nead) service definitions:
```js
// danf.js

const config = require('./config/config');
const services = require('./config/services');

module.exports = danf => [
  danf.compose(config),
  danf.compose(services)
];
```

> You may use an `index.js` file to aggregate your config and compose it in only one line.

Finally, here is the code that executes danf processing and starts importing your data:
```js
// index.js

const danf = require('danf');
const config = require('./danf');

const importer = danf.build(config, ['importer']);

importer.importAll();
```

This is a really short example, so using Danf in this situation may seems a useless overhead.
But on bigger application/library, it is a good practice to:
- validate your dependencies to avoid runtime errors
- make independent components respecting low coupling rules
- segregate concepts (implementation, injection, flow, ...)
- make a more declarative code which is comprehensible at first sight

In this example, all components are independent and linked by configuration.
You almost only have to read `config/config.js` to understand how all independent components work together.

> True story: with this way of programming, it is possible for a non-developer to add an import (if no new fetcher, parser or persister is needed of course).

## Use
```js
// CommonJS
const danf = require('danf');

// ES6 modules
import danf from 'danf';
```

### Define danf configuration file
Danf configuration file must exports a [nead definition object](https://github.com/gnodi/nead#create-services-from-a-definition-object) or a function returning a nead definition object.
```js
// config/config.js

const foo = require('foo');
const Bar = require('../src/Bar');

module.exports = {
  foo: {
    factory: 'service',
    object: foo,
    dependencies: {
      bar: '#bar'
    }
  },
  bar: {
    factory: 'service',
    object: Bar
  }
};
```

#### danf.set
You can use `danf.set` method to help defining service definition set:

Here is a file registering a list of services:
```js
// src/items/index.js

const plop = require('./plop');
const plip = require('./plip');
const plap = require('./plap');

module.exports = {
  plop,
  plip,
  plap
};
```

Here is the danf configuration file using this list:
```js
// config/config.js

const foo = require('foo');
const Bar = require('../src/Bar');
const items = require('../src/items');

module.exports = (danf) => ({
  foo: {
    factory: 'service',
    object: foo
  },
  bar: {
    factory: 'service',
    object: Bar
  },
  item: {
    factory: 'set',
    items: danf.set(items, {
      plop: {
        dependencies: {
          foo: '#foo'
        }
      },
      plip: {
        dependencies: {
          bar: '#bar'
        }
      }
    })
  },
});
```

In this case, `danf.set` will return a set of service definitions equivalent to:
```js
{
  plop: {
    object: require('../src/items/plop'),
    dependencies: {
      foo: '#foo'
    }
  },
  plip: {
    object: require('../src/items/plip'),
    dependencies: {
      bar: '#bar'
    }
  },
  plap: {
    object: require('../src/items/plap')
  }
}
```

### Define danf composition file
Danf composition file must export an array of [nead definition object](https://github.com/gnodi/nead#create-services-from-a-definition-object) or a function returning an array of nead definition object. It can compose another composition file too.
```js
// danf.js

module.exports = [
  {
    plop: {
      factory: 'service',
      object: require('plop')
    },
    plip: {
      factory: 'service',
      object: require('plip')
    }
  },
  {
    plop: {
      factory: 'service',
      object: require('../src/plop')
    },
    plap: {
      factory: 'service',
      object: require('../src/plap')
    }
  }
];
```

Composition items will be merged intelligently. In this example, `plop` service of the second item will overwrite the one of the first item.

#### danf.compose
In fact, danf composition file is used to compose danf internal configuration file or danf composition file of other packages. You can use `danf.compose` to achieve this easily:
```js
// danf.js

const lib = require('lib/danf');
const config = require('./config');

module.exports = danf => [
  danf.compose(lib, 'foo'),
  danf.compose(config)
];
```

Second argument is a namespace to prefix all composed services in order to avoid naming collision (e.g. `server` => `foo.server`).

### Build dependency injection container
You have to use `danf.build` method to build dependency injection container.

Here is a basic example for an application:
```js
// index.js

const danf = require('danf');
const config = require('./danf');

const container = danf.build(config);
const server = container.get('server');
server.start();
```

Here is a basic example for a library:
```js
// index.js

const danf = require('danf');
const config = require('./danf');

// If second argument is defined, "build" method returns an object only containing
// given services.
const services = danf.build(config, ['server']);

module.exports = services;
```

> This allows anyone to use your library from another library or application not using Danf in a completely transparent way.

## Testing
Many `npm` scripts are available to help testing:
```sh
$ npm run {script}
```
- `check`: lint and check unit and integration tests
- `lint`: lint
- `test`: check unit tests
- `test-coverage`: check coverage of unit tests
- `test-debug`: debug unit tests
- `test-integration`: check integration tests
- `test-watch`: work in TDD!

Use `npm run check` to check that everything is ok.

## Contributing
If you want to contribute, just fork this repository and make a pull request!

Your development must respect these rules:
- fast
- easy
- light

You must keep test coverage at 100%.

## License
[MIT](LICENSE)

[build-image]: https://img.shields.io/travis/gnodi/danf.svg?style=flat
[build-url]: https://travis-ci.org/gnodi/danf
[coverage-image]:https://coveralls.io/repos/github/gnodi/danf/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/gnodi/danf?branch=master
[version-image]: https://img.shields.io/npm/v/danf.svg?style=flat
[version-url]: https://npmjs.org/package/danf
[downloads-image]: https://img.shields.io/npm/dm/danf.svg?style=flat
[downloads-url]: https://npmjs.org/package/danf
[dependencies-image]: https://david-dm.org/gnodi/danf.svg
[dependencies-url]: https://david-dm.org/gnodi/danf
[dev-dependencies-image]: https://david-dm.org/gnodi/danf/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/gnodi/danf#info=devDependencies
