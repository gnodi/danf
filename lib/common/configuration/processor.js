'use strict';

/**
 * Expose `Processor`.
 */
module.exports = Processor;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    SectionProcessor = require('./section-processor')
;

/**
 * Initialize a new processor for the config.
 */
function Processor() {
    this._sections = {};
}

Processor.defineImplementedInterfaces(['danf:configuration.processor']);

Processor.defineDependency('_configurationResolver', 'danf:manipulation.dataResolver');
Processor.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
Processor.defineDependency('_namespacer', 'danf:configuration.namespacer');
Processor.defineDependency('_sections', 'danf:configuration.sectionProcessor_object');
Processor.defineDependency('_environment', 'string');

/**
 * Configuration resolver.
 *
 * @var {danf:manipulation.dataResolver}
 * @api public
 */
Object.defineProperty(Processor.prototype, 'configurationResolver', {
    set: function(configurationResolver) {
        this._configurationResolver = configurationResolver;
    }
});

/**
 * Reference resolver.
 *
 * @var {danf:manipulation.referenceResolver}
 * @api public
 */
Object.defineProperty(Processor.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver;
    }
});

/**
 * Namespacer.
 *
 * @var {danf:configuration.namespacer}
 * @api public
 */
Object.defineProperty(Processor.prototype, 'namespacer', {
    set: function(namespacer) {
        this._namespacer = namespacer;
    }
});

/**
 * Environment.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Processor.prototype, 'environment', {
    set: function(environment) {
        this._environment = environment;
    }
});

/**
 * SSSection processors.
 *
 * @var {danf:configuration.sectionProcessor_object}
 * @api public
 */
Object.defineProperty(Processor.prototype, 'sectionProcessors', {
    set: function(sectionProcessors) {
        for (var i = 0; i < sectionProcessors.length; i++) {
            this.addSectionProcessor(sectionProcessors[i]);
        }
    }
});

/**
 * @interface {danf:configuration.processor}
 */
Processor.prototype.process = function(modulesTree) {
    var root = modulesTree.getRoot(),
        sections = utils.merge(this._sections, buildConfigSections(root, this._configurationResolver, this._referenceResolver, this._namespacer)),
        config = {}
    ;

    // Process the config for priority module.
    config = processConfig(config, sections, modulesTree, true, this._environment);

    // Pre process the config.
    var modules = modulesTree.getFlat(true);

    for (var name in sections) {
        var section = sections[name];

        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];

            module.config = section.interpretAllModuleConfig(module.config || {}, module, modulesTree);
            section.contract = section.interpretAllModuleConfig(section.contract || {}, module, modulesTree);

            modules[i].config = section.preProcess(module.config, config[name] || {}, modulesTree);
            modules[i].config = section.preProcess(module.config, config['{0}/{1}'.format(name, 'dev')] || {}, modulesTree);
        }
    }

    // Process the config.
    config = processConfig(config, sections, modulesTree, false, this._environment);

    // Post process the config.
    for (var name in sections) {
        config = sections[name].postProcess(config, config[name] || {}, modulesTree);
        config = sections[name].postProcess(config, config['{0}/{1}'.format(name, 'dev')] || {}, modulesTree);
    }

    return config;
}

/**
 * Add a section processor.
 *
 * @param {danf:configuration.sectionProcessor} processor The processor of a section.
 * @api public
 */
Processor.prototype.addSectionProcessor = function(sectionProcessor) {
    addSectionProcessor(this._sections, sectionProcessor);
}

/**
 * Add a section processor.
 *
 * @param {object} The processors of the sections.
 * @param {danf:configuration.sectionProcessor} sectionProcessor The processor of a section.
 * @api private
 */
var addSectionProcessor = function(sections, sectionProcessor) {
    sections[sectionProcessor.name] = sectionProcessor;
}

/**
 * Build the config section processors of the module.
 *
 * @param {danf:configuration.module} module A module.
 * @param {danf:manipulation.dataResolver} configurationResolver The configuration resolver.
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 * @api private
 */
var buildConfigSections = function(module, configurationResolver, referenceResolver, namespacer) {
    var sections = {};

    if (undefined === module.alias) {
        var sectionProcessor = new SectionProcessor();

        sectionProcessor.name = module.id;
        sectionProcessor.contract = module.contract;
        sectionProcessor.configurationResolver = configurationResolver;
        sectionProcessor.referenceResolver = referenceResolver;
        sectionProcessor.namespacer = namespacer;

        addSectionProcessor(
            sections,
            sectionProcessor
        );
    }

    for (var id in module.dependencies) {
        var dependency = module.dependencies[id];

        if ('string' !== typeof dependency) {
            sections = utils.merge(
                sections,
                buildConfigSections(
                    dependency,
                    configurationResolver,
                    referenceResolver,
                    namespacer
                )
            );
        }
    }

    return sections;
}

/**
 * Process the config.
 *
 * @param {object} The config.
 * @param {danf:configuration.sectionProcessor_object} sections The section processors.
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @param {boolean} Whether or not this is a priority processing.
 * @param {string} The environment.
 * @return {object} The processed config.
 * @api private
 */
var processConfig = function(config, sections, modulesTree, priority, environment) {
    for (var name in sections) {
        var section = sections[name];

        if ((priority && section.priority)
            || (!priority && !section.priority)
        ) {
            var sectionConfig = section.process(modulesTree, environment);

            if (sectionConfig) {
                config[name] = sectionConfig;
            }
        }
    }

    return config;
}