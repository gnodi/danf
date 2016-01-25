'use strict';

/**
 * Expose `Parser`.
 */
module.exports = Parser;

/**
 * Initialize a new command parser.
 */
function Parser() {}

Parser.defineImplementedInterfaces(['danf:manipulation.callbackExecutor']);

Parser.defineDependency('_commandProvider', 'danf:dependencyInjection.provider', 'danf:command.command');

/**
 * Command provider.
 *
 * @var {danf:manipulation.provider<danf:command.command>}
 * @api public
 */
Object.defineProperty(Parser.prototype, 'commandProvider', {
    set: function(commandProvider) { this._commandProvider = commandProvider; }
});

/**
 * @interface {danf:command.parser}
 */
Parser.prototype.parse = function(line, contract, aliases) {
    var command = this._commandProvider.provide(),
        quotedParameters = [],
        splitLine = line
            .replace(/(\s)?"(((?!"\s).)*)"(\s|$)/g, function(match, p1, p2, p3, p4) {
                quotedParameters.push(p2);

                return '{0}{1}{2}'.format(' ' === p1 ? ' ' : '', '{0}', ' ' === p4 ? ' ' : '');
            })
            .split(' ')
            .map(function(value) {
                if ('{0}' === value) {
                    value = value.format(quotedParameters.shift());
                }

                return value;
            })
        ,
        nonHyphenatedParameters = [],
        context = '_',
        setContext = function(parameterName) {
            if (undefined === contract[parameterName]) {
                throw new Error(
                    'Unexpected parameter "{0}" passed to the command "{1}".'.format(
                        parameterName,
                        command.name
                    )
                );
            }

            if ('boolean' === contract[parameterName].type) {
                command.setParameter(parameterName, true);
            } else if ('number' === contract[parameterName].type) {
                if (!command.hasParameter(parameterName)) {
                    command.setParameter(parameterName, 1);
                } else {
                    command.setParameter(
                        parameterName,
                        command.getParameter(parameterName) + 1
                    );
                }
            }

            if (parameterName !== context && '_' !== context) {
                if (!command.hasParameter(context)) {
                    throw new Error(
                        'Missing parameter "{0}" value for the command "{1}".'.format(
                            context,
                            command.name
                        )
                    );
                }
            }

            context = parameterName;
        }
    ;

    command.name = splitLine.shift();

    for (var i = 0; i < splitLine.length; i++) {
        var word = splitLine[i];

        // Handle case of a parameter.
        if (/^--.*/.test(word)) {
            var parameterName = word.replace(/^--/, '');

            setContext(parameterName);
        // Handle case of list of parameter shorcuts.
        } else if (/^-.*/.test(word)) {
            var parameterAliases = word.replace(/^-/, '');

            for (var j = 0; j < parameterAliases.length; j++) {
                var parameterAlias = parameterAliases[j],
                    parameterName = aliases[parameterAlias]
                ;

                if (undefined === parameterName) {
                    throw new Error(
                        'Unknown alias "{0}" passed to the command "{1}".'.format(
                            parameterAlias,
                            command.name
                        )
                    );
                }

                setContext(parameterName);
            }
        // Handle case of a value.
        } else {
            var isArrayParameter =
                    'array' === contract[context].type || /_array$/.test(contract[context].type)
                ,
                value = word
            ;

            try {
                value = JSON.parse(value);
            } catch(error) {}

            // Handle case of an array parameter.
            if (isArrayParameter) {
                // Handle case of an array value.
                if (Array.isArray(value)) {
                    if (command.hasParameter(context)) {
                        // Concat with existing value.
                        command.setParameter(
                            context,
                            command.getParameter(context).concat(value)
                        );
                    } else {
                        command.setParameter(context, value);
                    }

                    // Reset context.
                    context = '_';
                // Handle case of a single item value.
                } else {
                    if (command.hasParameter(context)) {
                        // Push to existing value.
                        command.getParameter(context).push(value)
                    } else {
                        command.setParameter(context, [value]);
                    }
                }
            // Handle case of a non array parameter.
            } else {
                command.setParameter(context, value);

                // Reset context.
                context = '_';
            }
        }
    }

    setContext('_');

    return command;
}