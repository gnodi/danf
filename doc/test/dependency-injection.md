Use Dependency Injection
========================

[←](index.md)

Application
-----------

Now, it is time to define our objects (the instantiations of our classes) and their interactions. In danf, a powerful dependency injection allows you to describe it in the config:

```javascript
// config/server/services.js

'use strict';

module.exports = {
    frameworkSelector: {
        class: '%classes.frameworkSelector%',
        properties: {
            frameworks: '$frameworks$',
            categoryComputers: '&categoryComputer&'
        }
    },
    questionsRetriever: {
        class: '%classes.questionsRetriever%',
        properties: {
            questions: '$questions$'
        }
    },
    categoryComputer: {
        tags: ['categoryComputer'],
        properties: {
            scoresDirectory: '$questions.directory$',
            sequencerProvider: '#danf:event.currentSequencerProvider#',
            benchmarker: '#benchmarker#'
        },
        children: {
            dumb: {
                class: '%classes.categoryComputer.dumb%',
                abstract: true,
                declinations: '$questions.dumb$',
                properties: {
                    boost: '@boost@',
                    questions: '@questions@'
                }
            },
            useless: {
                class: '%classes.categoryComputer.useless%',
                abstract: true,
                declinations: '$questions.useless$',
                properties: {
                    boost: '@boost@',
                    questions: '@questions@'
                }
            }
        }
    }
};
```

The objects and interactions between them are the base of your architecture. Just looking at this config can give you a quick idea of how your program works. As it is defined in a configuration file, you can change a dependency dynamically. We can give quick explanations to show some of the possibilities of this dependency injection.

This config will create 5 services: `frameworkSelector`, `questionsRetriever`, `categoryComputer.dumb.mega`, `categoryComputer.dumb.hyper`, `categoryComputer.useless.super`.

The service `danf:event.currentSequencerProvider` is injected into both `categoryComputer.dumb` and `categoryComputer.useless` in the property `sequencerProvider` thanks to the reference `#danf:event.currentSequencerProvider#`.

The services tagged `categoryComputer` (i.e. `categoryComputer.dumb` and `categoryComputer.useless`) are injected into `frameworkSelector` in the property `categoryComputers` thanks to the reference `&categoryComputer&`.

The list of configured frameworks (in `config/server/this.js`) are injected into `frameworkSelector` in the property `frameworks` thanks to the reference `$frameworks$`.

A declination of service is created for each configured dumb question category (mega and hyper) and the associated configured boost and questions are injected thanks to `@boost@` and `@questions@`.

The last thing to note is that the classes are defined with parameter references (`%classes.frameworkSelector%`). This allows to factorize the `require` calls and provides an easy way to override the class of a service.

This topic is one of the most complicated and certainly need some practice to feel comfortable with it. Check the documentation accessible below in the navigation part to learn more about it.

Navigation
----------

[Previous section](object.md) |
 [Next section](client-side.md)

[Documentation](../use/dependency-injection.md)

[←](index.md)