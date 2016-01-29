'use strict';

/**
 * Expose `Parser`.
 */
module.exports = Parser;

/**
 * Initialize a new command parser.
 */
function Parser() {}

Parser.defineImplementedInterfaces(['danf:command.parser']);

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
        quotedOptions = [],
        splitLine = line
            .replace(/(\s)?"(((?!"\s).)*)"(\s|$)/g, function(match, p1, p2, p3, p4) {
                quotedOptions.push(p2);

                return '{0}{1}{2}'.format(' ' === p1 ? ' ' : '', '{0}', ' ' === p4 ? ' ' : '');
            })
            .split(' ')
            .map(function(value) {
                if ('{0}' === value) {
                    value = value.format(quotedOptions.shift());
                }

                return value;
            })
        ,
        nonHyphenatedOptions = [],
        context = '_',
        setContext = function(optionName) {
            if (contract) {
                if (undefined === contract[optionName]) {
                    throw new Error(
                        'Unexpected option "{0}" passed to the command "{1}".'.format(
                            optionName,
                            command.name
                        )
                    );
                }

                if ('boolean' === contract[optionName].type) {
                    command.setOption(optionName, true);
                } else if ('number' === contract[optionName].type) {
                    if (!command.hasOption(optionName)) {
                        command.setOption(optionName, 1);
                    } else {
                        command.setOption(
                            optionName,
                            command.getOption(optionName) + 1
                        );
                    }
                }

                if (optionName !== context && '_' !== context) {
                    if (!command.hasOption(context)) {
                        throw new Error(
                            'Missing option "{0}" value for the command "{1}".'.format(
                                context,
                                command.name
                            )
                        );
                    }
                }
            } else {
                command.setOption(optionName, true);
            }

            context = optionName;
        }
    ;

    command.name = splitLine.shift();

    for (var i = 0; i < splitLine.length; i++) {
        var word = splitLine[i];

        // Handle case of a option.
        if (/^--.*/.test(word)) {
            var optionName = word.replace(/^--/, '');

            setContext(optionName);
        // Handle case of list of option shorcuts.
        } else if (/^-.*/.test(word)) {
            var optionAliases = word.replace(/^-/, '');

            for (var j = 0; j < optionAliases.length; j++) {
                var optionAlias = optionAliases[j],
                    optionName = aliases[optionAlias]
                ;

                if (undefined === optionName) {
                    throw new Error(
                        'Unknown alias "{0}" passed to the command "{1}".'.format(
                            optionAlias,
                            command.name
                        )
                    );
                }

                setContext(optionName);
            }
        // Handle case of a value.
        } else {
            var isArrayOption = (
                    contract &&
                    (
                        'array' === contract[context].type ||
                        /_array$/.test(contract[context].type)
                    )
                ),
                value = word
            ;

            try {
                value = JSON.parse(value);
            } catch(error) {}

            // Handle case of an array option.
            if (isArrayOption) {
                // Handle case of an array value.
                if (Array.isArray(value)) {
                    if (command.hasOption(context)) {
                        // Concat with existing value.
                        command.setOption(
                            context,
                            command.getOption(context).concat(value)
                        );
                    } else {
                        command.setOption(context, value);
                    }

                    // Reset context.
                    context = '_';
                // Handle case of a single item value.
                } else {
                    if (command.hasOption(context)) {
                        // Push to existing value.
                        command.getOption(context).push(value)
                    } else {
                        command.setOption(context, [value]);
                    }
                }
            // Handle case of a non array option.
            } else {
                command.setOption(context, value);

                // Reset context.
                context = '_';
            }
        }
    }

    setContext('_');

    return command;
}