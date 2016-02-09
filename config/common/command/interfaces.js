module.exports = {
    command: {
        methods: {
            /**
             * Set an option.
             *
             * @param {string} name The identifier name of the option.
             * @param {mixed} value The value of the option.
             */
            setOption: {
                arguments: ['string/name', 'mixed/value']
            },
            /**
             * Set an option.
             *
             * @param {string} name The identifier name of the option.
             * @return {mixed} The value of the option.
             */
            getOption: {
                arguments: ['string/name'],
                returns: 'mixed'
            },
            /**
             * Set an option.
             *
             * @param {string} name The identifier name of the option.
             * @return {boolean} Whether or not the option exists.
             */
            hasOption: {
                arguments: ['string/name'],
                returns: 'boolean'
            }
        },
        getters: {
            /**
             * Name.
             *
             * @return {string}
             */
            name: 'string',
            /**
             * Options.
             *
             * @return {object}
             */
            options: 'object',
        },
        setters: {
            /**
             * Name.
             *
             * @param {string}
             */
            name: 'string',
            /**
             * Options.
             *
             * @param {object}
             */
            options: 'object',
        }
    },
    parser: {
        methods: {
            /**
             * Parse a command line.
             *
             * @param {string} line The command line.
             * @param {object} contract The contract that the options should respect.
             * @param {string_object} aliases The options aliases.
             * @return {danf:command.command} The resulting command.
             */
            parse: {
                arguments: ['string/line', 'object/contract', 'string_object/aliases'],
                returns: 'danf:command.command'
            }
        }
    }
};