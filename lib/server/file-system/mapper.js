'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

/**
 * Expose `Mapper`.
 */
module.exports = Mapper;

/**
 * Initialize a new mapper.
 *
 * @param defaultExtension The default extension.
 */
function Mapper(defaultExtension) {
    this._files = {};
    this._excludedFiles = {};
    this._directories = {};
    this._excludedDirectories = {};
    this.defaultExtension = defaultExtension || 'js';
}

Mapper.defineImplementedInterfaces(['danf:fileSystem.mapper', 'danf:manipulation.registryObserver']);

/**
 * Set the default extension.
 *
 * @return {string}
 * @api public
 */
Object.defineProperty(Mapper.prototype, 'defaultExtension', {
    set: function(defaultExtension) {
        Object.checkType(defaultExtension, 'string');

        this._defaultExtension = defaultExtension;
    }
});

/**
 * @interface {danf:manipulation.registryObserver}
 */
Mapper.prototype.handleRegistryChange = function(items, reset, name) {
    var defaultExtension = '.{0}'.format(this._defaultExtension);

    for (var key in items) {
        var path = items[key],
            excluded = '!' === key.substring(0, 1),
            isDirectory = false
        ;

        try {
            path = fs.realpathSync(path);

            try {
                path = fs.realpathSync(path + defaultExtension);
                isDirectory = true;
                // The path correspond to a file and a directory
            } catch (fatalError) {
                // The path correspond to a simple directory.
            }
        } catch (error) {
            try {
                path = fs.realpathSync(path + defaultExtension);
                // The path correspond to a file.
            } catch (fatalError) {
                throw new Error(
                    'There is no such file "{0}" or directory "{1}".'.format(
                        path + defaultExtension,
                        path
                    )
                );
            }
        }

        var stats = fs.statSync(path),
            isFile = stats.isFile()
        ;

        isDirectory = isDirectory ? true : !isFile

        if (excluded) {
            key = key.substring(1);
        }
        path = path.replace(/\\/g, '/');

        if (isFile) {
            var extPos = key.indexOf('.'),
                file = key
            ;

            // Case of an omitted extension.
            if (-1 === extPos || extPos === key.indexOf('..')) {
                file += defaultExtension;
            }

            if (excluded) {
                this._excludedFiles[file] = path;
            } else {
                this._files[file] = path
            }
        }

        if (isDirectory) {
            var directory = {
                regexp: new RegExp('^{0}/'.format(key)),
                path: path
            };

            if (excluded) {
                this._excludedDirectories[key] = directory;
            } else {
                this._directories[key] = directory;
            }
        }
    }
}

/**
 * @interface {danf:fileSystem.mapper}
 */
Mapper.prototype.match = function(path) {
    var excluded = false;

    if (-1 !== path.indexOf('..')) {
        throw new Error('You are not allowed to use ".." in the path "{0}".'.format(path));
    }

    // If no extension found, use the default one.
    if (!hasExtension(path)) {
        path += '.{0}'.format(this._defaultExtension);
    }

    if (this._excludedFiles[path]) {
        excluded = true;
    } else if (this._files[path]) {
        return this._files[path];
    }

    if (!excluded) {
        for (var key in this._excludedDirectories) {
            var directory = this._excludedDirectories[key];

            if (directory.regexp.test(path)) {
                excluded = true;

                break;
            }
        }

        if (!excluded) {
            for (var key in this._directories) {
                var directory = this._directories[key];

                if (directory.regexp.test(path)) {
                    return '{0}{1}'.format(
                        directory.path,
                        path.substring(key.length)
                    );
                }
            }
        }
    }

    throw new Error('No mapping found for the path "{0}".'.format(path));
}

/**
 * Check if a path has an extension.
 *
 * @param {string} path The path.
 * @return {boolean} True if the path has an extension, false otherwise.
 * @api private
 */
var hasExtension = function(path) {
    path = path.replace(/\\/g, '/');

    var lastSlashPos = path.lastIndexOf('/'),
        directory = -1 !== lastSlashPos ? path.substring(lastSlashPos + 1) : path,
        extPos = directory.indexOf('.')
    ;

    return -1 !== extPos && extPos !== directory.indexOf('..');
}