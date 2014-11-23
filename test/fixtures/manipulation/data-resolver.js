'use strict';

require('../../../lib/init');

var DataResolver = require('../../../lib/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../../../lib/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/manipulation/data-interpreter/type')
;

var dataResolver = new DataResolver();

dataResolver.addDataInterpreter(new DefaultDataInterpreter());
dataResolver.addDataInterpreter(new RequiredDataInterpreter());
dataResolver.addDataInterpreter(new TypeDataInterpreter());

module.exports = dataResolver;