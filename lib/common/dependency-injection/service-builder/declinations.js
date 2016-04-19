'use strict';

/**
 * Expose `Declinations`.
 */
module.exports = Declinations;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new declinations service builder.
 */
function Declinations() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1400;

    this._declinations = {};
    this._handleDeclinations = false;
}

utils.extend(AbstractServiceBuilder, Declinations);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Declinations.prototype, 'contract', {
    value: {
        declinations: {
            type: 'mixed'
        },
        key: {
            type: 'string|number'
        }
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Declinations.prototype.resolve = function(definition) {
    if (definition.declinations) {
        if (definition.children) {
            throw new Error(
                'The service "{0}" cannot define both the declinations and children parameters.'.format(
                    definition.id
                )
            );
        }

        definition.abstract = true;

        if ('object' !== typeof definition.declinations) {
            throw new Error(
                'The declinations parameter of the service "{0}" should be an object.'.format(
                    definition.id
                )
            );
        }

        for (var key in definition.declinations) {
            var declination = definition.declinations[key],
                declinationId = key
            ;

            if ('object' === typeof declination && !Array.isArray(declination)) {
                definition.declinations[key]['_'] = key;
            }

            if (Array.isArray(declination)) {
                declinationId = declination;
            }

            var declinationService = utils.clone(definition);

            declinationService = this._referenceResolver.resolve(
                declinationService,
                '@',
                declination,
                'the definition of the service "{0}"'.format(definition.id)
            );

            if (null != definition.key) {
                declinationId = definition.key;
            }

            declinationService.declinations = null;
            declinationService.key = key;
            declinationService.abstract = false;
            declinationService.id = '{0}.{1}'.format(definition.id, declinationId);

            this._declinations[declinationService.id] = declinationService;
        }
    }

    return definition;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Declinations.prototype.define = function(definition) {
    if (!this._handleDeclinations && this._declinations) {
        this._handleDeclinations = true;

        for (var id in this._declinations) {
            this._servicesContainer.setDefinition(id, this._declinations[id]);
            delete this._declinations[id];
        }

        this._handleDeclinations = false;
    }

    return definition;
}