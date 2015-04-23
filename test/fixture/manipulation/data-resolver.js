'use strict';

require('../../../lib/common/init');

var DataResolver = require('../../../lib/common/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/type')
;

var dataResolver = new DataResolver();

dataResolver.addDataInterpreter(new DefaultDataInterpreter());
dataResolver.addDataInterpreter(new RequiredDataInterpreter());
dataResolver.addDataInterpreter(new TypeDataInterpreter());

module.exports = dataResolver;