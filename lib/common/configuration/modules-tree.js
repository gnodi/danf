'use strict';

/**
 * Expose `ModulesTree`.
 */
module.exports = ModulesTree;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    Module = require('./mod')
;

/**
 * Initialize a new modules tree for the configuration.
 */
function ModulesTree() {
    this._root = {};
}

ModulesTree.defineImplementedInterfaces(['danf:configuration.modulesTree']);

ModulesTree.defineDependency('_appName', 'string');

/**
 * @interface {danf:configuration.modulesTree}
 */
Object.defineProperty(ModulesTree.prototype, 'appName', {
    get: function() { return this._appName; },
    set: function(appName) { this._appName = appName; }
});

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.build = function(root, danf) {
    var danfModule = new Module(),
        rootModule = buildBranch(root, this._appName, 0)
    ;
    danfModule.id = 'danf';
    danfModule.config = danf;
    danfModule.level = 1000;

    danfModule.setDependency(
        this._appName,
        replaceAliases.call(this, rootModule)
    );

    this._root = danfModule;
}

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.getRoot = function() {
    return this._root;
}

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.get = function(id) {
    var module = get(this._root, id);

    if (module) {
        return module;
    }

    throw new Error('No module "{0}" found.'.format(id));
}

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.getLevel = function(level) {
    return getLevel(this._root, level);
}

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.getFlat = function(inversed) {
    return getFlat(this._root, inversed);
}

/**
 * @interface {danf:configuration.modulesTree}
 */
ModulesTree.prototype.getChild = function(module, relativeId) {
    if (!relativeId) {
        return module;
    }

    return getChild.call(this, module, relativeId.split(':'));
}

/**
 * Build a branch.
 *
 * @param {danf:configuration.module} module A danf module.
 * @param {string} id The id of the branch.
 * @return {object} The branch.
 * @api private
 */
var buildBranch = function(module, id, level, parent, overriddenDependencies) {
    var dependencies = utils.clone(module.dependencies),
        mod = new Module()
    ;

    mod.id = id;
    mod.config = module.config;
    mod.contract = module.contract;
    mod.level = level;
    if (undefined !== parent) {
        mod.parent = parent.id;
    }

    if (undefined !== dependencies) {
        if ('object' !== typeof dependencies) {
            throw new Error(
                'The parameter "dependencies" of a danf configuration file must be an object.'
            );
        }

        for (var dependencyAlias in dependencies) {
            var dependency = dependencies[dependencyAlias];

            if ('string' === typeof dependency) {
                dependencies[dependencyAlias] = '{0}:{1}'.format(id, dependency);
            }
        }

        if (undefined !== overriddenDependencies) {
            for (var dependencyAlias in overriddenDependencies) {
                if (-1 !== dependencyAlias.indexOf(':')) {
                    if (undefined === dependencies[dependencyAlias]) {
                        throw new Error(
                            'You try to override a non-existent dependency "{0}" in the module "{1}".'.format(
                                dependencyAlias,
                                id
                            )
                        );
                    }
                }

                dependencies[dependencyAlias] = overriddenDependencies[dependencyAlias];
            }
        }

        var modOverriddenDependencies = {};

        for (var dependencyAlias in dependencies) {
            var index = dependencyAlias.indexOf(':');

            if (-1 !== index) {
                var aliasPrefix = dependencyAlias.substr(0, index),
                    aliasSuffix = dependencyAlias.substring(index + 1)
                ;

                if (undefined === modOverriddenDependencies[aliasPrefix]) {
                    modOverriddenDependencies[aliasPrefix] = {}
                }

                if ('string' !== typeof dependencies[dependencyAlias]) {
                    throw new Error(
                        'You have to specify the name of another module to override the dependency "{0}" in the module "{1}".'.format(
                            dependencyAlias,
                            id
                        )
                    );
                }

                modOverriddenDependencies[aliasPrefix][aliasSuffix] = dependencies[dependencyAlias];
            }
        }

        for (var dependencyAlias in dependencies) {
            var aliasPrefix = dependencyAlias.split(':')[0],
                dependencyId = '{0}:{1}'.format(id, dependencyAlias)
            ;

            if ('string' !== typeof dependencies[dependencyAlias]) {
                mod.setDependency(
                    dependencyId,
                    buildBranch(
                        dependencies[dependencyAlias],
                        dependencyId,
                        level + 1,
                        mod,
                        modOverriddenDependencies[aliasPrefix]
                    )
                );
            } else if (
                undefined === modOverriddenDependencies[aliasPrefix]
                || aliasPrefix === dependencyAlias
            ) {
                mod.setDependency(
                    dependencyId,
                    dependencies[dependencyAlias]
                );
            }
        }
    } else if (undefined !== overriddenDependencies) {
        for (var dependencyAlias in overriddenDependencies) {
            throw new Error(
                'You try to override a non-existent dependency "{0}" in the module "{1}".'.format(
                    dependencyAlias,
                    id
                )
            );
        }
    }

    return mod;
}

/**
 * Replace the aliases.
 *
 * @param {danf:configuration.module} module A danf module.
 * @return {danf:configuration.module} The module with replaced aliases.
 * @api private
 */
var replaceAliases = function(module) {
    for (var dependencyId in module.dependencies) {
        var dependency = module.dependencies[dependencyId];

        if ('string' === typeof dependency) {
            var moduleDependency = new Module();
            moduleDependency.id = dependencyId;
            moduleDependency.alias = dependency;

            dependency = moduleDependency;
        }

        module.dependencies[dependencyId] = replaceAliases.call(this, dependency);
    }

    return module;
}

/**
 * Get a module from its id.
 *
 * @param {danf:configuration.module} module A danf module.
 * @param {string} id The id of the module.
 * @return {danf:configuration.module} The module.
 * @api private
 */
var get = function(module, id) {
    if (module.id === id) {
        return module;
    }

    for (var dependencyId in module.dependencies) {
        var dependency = module.dependencies[dependencyId];

        if (undefined === dependency.alias) {
            var dependencyModule = get(dependency, id);

            if (dependencyModule instanceof Module) {
                return dependencyModule;
            }
        }
    }

    return null;
}

/**
 * Get the modules with no hierarchy ordered by level.
 *
 * @param {danf:configuration.module} module A danf module.
 * @param {boolean} Inversed order?
 * @return {danf:configuration.module_array} The modules with no hierarchy.
 * @api private
 */
var getFlat = function(module, inversed) {
    var modules = [],
        level = -1,
        levelModules = [module]
    ;

    while (0 !== levelModules.length) {
        if (inversed) {
            modules = levelModules.concat(modules);
        } else {
            modules = modules.concat(levelModules);
        }

        level++;
        levelModules = getLevel(module, level);
    }

    return modules;
}

/**
 * Get the modules of a level.
 *
 * @param {danf:configuration.module} module A danf module.
 * @param {number} level A level of definition.
 * @return {danf:configuration.module_array} The modules of the level.
 * @api private
 */
var getLevel = function(module, level) {
    var modules = [];

    if (module.level === level) {
        modules.push(module);
    }

    for (var alias in module.dependencies) {
        var dependency = module.dependencies[alias];

        modules = modules.concat(getLevel(dependency, level));
    }

    return modules;
}

/**
 * Get the child module of another module from its relative id.
 *
 * @param {danf:configuration.module} module The module.
 * @param {string} relativeId The child module id relative to the module.
 * @return {danf:configuration.module} The child module.
 * @api private
 */
var getChild = function(module, relativeId) {
    var id = relativeId.shift();

    if (!id) {
        return module;
    }

    var idLength = module.id.length + 1,
        child
    ;

    for (var alias in module.dependencies) {
        if (id === alias.substr(idLength)) {
            var dependency = module.dependencies[alias];

            // Alias case.
            if (dependency.alias) {
                child = get(this._root, dependency.alias);
            // Standard case.
            } else {
                child = dependency;
            }
        }
    }

    if (!child) {
        throw new Error(
            'No child module "{0}" found for the module "{1}".'.format(
                id,
                module.id
            )
        );
    }

    return getChild.call(this, child, relativeId);
}