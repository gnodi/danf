'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Parser = require('../../../lib/common/command/parser')
;

var commandProvider = require('../../fixture/command/command-provider'),
    parser = new Parser()
;

parser.commandProvider = commandProvider;

var parsingTests = [
    {
        line: 'foo0',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            }
        },
        expected: {
            _name: 'foo0',
            _options: {}
        }
    },
    {
        line: 'foo1 val',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            }
        },
        expected: {
            _name: 'foo1',
            _options: {
                _: ['val']
            }
        }
    },
    {
        line: 'foo2 val1 val2',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            }
        },
        expected: {
            _name: 'foo2',
            _options: {
                _: ['val1', 'val2']
            }
        }
    },
    {
        line: 'foo3 --bar',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'boolean'
            }
        },
        expected: {
            _name: 'foo3',
            _options: {
                bar: true
            }
        }
    },
    {
        line: 'foo4 --bar',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            }
        },
        expected: {
            _name: 'foo4',
            _options: {
                bar: 1
            }
        }
    },
    {
        line: 'foo5 --bar 3',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            }
        },
        expected: {
            _name: 'foo5',
            _options: {
                bar: 3
            }
        }
    },
    {
        line: 'foo6 --bar val',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'string'
            }
        },
        expected: {
            _name: 'foo6',
            _options: {
                bar: 'val'
            }
        }
    },
    {
        line: 'foo7 --bar 3 6 7',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number_array'
            }
        },
        expected: {
            _name: 'foo7',
            _options: {
                bar: [3, 6, 7]
            }
        }
    },
    {
        line: 'foo8 --bar 3 6 val',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'mixed_array'
            }
        },
        expected: {
            _name: 'foo8',
            _options: {
                bar: [3, 6, 'val']
            }
        }
    },
    {
        line: 'foo9 --bar 3 6 val',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            }
        },
        expected: {
            _name: 'foo9',
            _options: {
                bar: 3,
                _: [6, 'val']
            }
        }
    },
    {
        line: 'foo10 --bar 3 6 val --foo',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            },
            foo: {
                type: 'boolean'
            }
        },
        expected: {
            _name: 'foo10',
            _options: {
                bar: 3,
                foo: true,
                _: [6, 'val']
            }
        }
    },
    {
        line: 'foo11 -b',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'boolean'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo11',
            _options: {
                bar: true
            }
        }
    },
    {
        line: 'foo12 -b',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo12',
            _options: {
                bar: 1
            }
        }
    },
    {
        line: 'foo13 -b 4',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'number'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo13',
            _options: {
                bar: 4
            }
        }
    },
    {
        line: 'foo14 -b plop plip',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'array'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo14',
            _options: {
                bar: ['plop', 'plip']
            }
        }
    },
    {
        line: 'foo15 -fb plop plip',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'array'
            },
            foo: {
                type: 'boolean'
            }
        },
        aliases: {
            b: 'bar',
            f: 'foo'
        },
        expected: {
            _name: 'foo15',
            _options: {
                bar: ['plop', 'plip'],
                foo: true
            }
        }
    },
    {
        line: 'foo16 -fb plop plip',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'string'
            },
            foo: {
                type: 'boolean'
            }
        },
        aliases: {
            b: 'bar',
            f: 'foo'
        },
        expected: {
            _name: 'foo16',
            _options: {
                bar: 'plop',
                foo: true,
                _: ['plip']
            }
        }
    },
    {
        line: 'foo17 -b plop -f plip',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string'
            }
        },
        aliases: {
            b: 'bar',
            f: 'foo'
        },
        expected: {
            _name: 'foo17',
            _options: {
                bar: 'plop',
                foo: 'plip'
            }
        }
    },
    {
        line: 'foo18 -b "plop plip"',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'string'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo18',
            _options: {
                bar: 'plop plip'
            }
        }
    },
    {
        line: 'foo19 -b {"a":1,"b":3,"c":4}',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'object'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo19',
            _options: {
                bar: {
                    a: 1,
                    b: 3,
                    c: 4
                }
            }
        }
    },
    {
        line: 'foo20 -b "{"a":1,"b":3,"c":"plop plip"}"',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'object'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo20',
            _options: {
                bar: {
                    a: 1,
                    b: 3,
                    c: 'plop plip'
                }
            }
        }
    },
    {
        line: 'foo21 -b "plop plip" --foo "plap plup" "plep plyp" "plyp plep"',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string'
            }
        },
        aliases: {
            b: 'bar'
        },
        expected: {
            _name: 'foo21',
            _options: {
                bar: 'plop plip',
                foo: 'plap plup',
                _: ['plep plyp', 'plyp plep']
            }
        }
    },
    {
        line: 'foo22 --foo bar',
        contract: {
            _: {
                type: 'mixed_array',
                default: []
            },
            foo: {
                type: 'boolean'
            }
        },
        expected: {
            _name: 'foo22',
            _options: {
                foo: true,
                _: ['bar']
            }
        }
    }
];

var parsingErrorTests = [
        {
            line: 'bar0 --foo val',
            contract: {
                _: {
                    type: 'mixed_array',
                    default: []
                }
            },
            expected: /Unexpected option "foo" passed to the command "bar0"\./
        },
        {
            line: 'bar1 --foo',
            contract: {
                _: {
                    type: 'mixed_array',
                    default: []
                },
                foo: {
                    type: 'string'
                }
            },
            expected: /Missing option "foo" value for the command "bar1"\./
        },
        {
            line: 'bar2 -fb plop plip',
            contract: {
                _: {
                    type: 'mixed_array',
                    default: []
                },
                foo: {
                    type: 'string'
                },
                bar: {
                    type: 'string'
                }
            },
            aliases: {
                f: 'foo',
                b: 'bar'
            },
            expected: /Missing option "foo" value for the command "bar2"\./
        },
        {
            line: 'bar3 -fb plop',
            contract: {
                _: {
                    type: 'mixed_array',
                    default: []
                },
                foo: {
                    type: 'boolean'
                },
                bar: {
                    type: 'string'
                }
            },
            aliases: {
                f: 'foo'
            },
            expected: /Unknown alias "b" passed to the command "bar3"\./
        }
    ]
;

describe('Parser', function() {
    describe('method "parse"', function() {
        parsingTests.forEach(function(test) {
            it('should parse a command line', function() {
                var command = parser.parse(test.line, test.contract, test.aliases || {});

                assert.deepEqual(command, test.expected);
            })
        });

        parsingErrorTests.forEach(function(test) {
            it('should fail to parse bad formatted command', function() {
                assert.throws(
                    function() {
                        parser.parse(test.line, test.contract, test.aliases || {});
                    },
                    test.expected
                );
            })
        });
    })
})