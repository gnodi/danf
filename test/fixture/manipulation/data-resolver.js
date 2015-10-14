'use strict';

require('../../../lib/common/init');

var DataResolver = require('../../../lib/common/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/default'),
    FlattenDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/flatten'),
    FormatDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/format'),
    RequiredDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/type'),
    ValidateDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/validate')
;

var dataResolver = new DataResolver();

dataResolver.addDataInterpreter(new DefaultDataInterpreter());
dataResolver.addDataInterpreter(new FlattenDataInterpreter());
dataResolver.addDataInterpreter(new FormatDataInterpreter());
dataResolver.addDataInterpreter(new RequiredDataInterpreter());
dataResolver.addDataInterpreter(new TypeDataInterpreter());
dataResolver.addDataInterpreter(new ValidateDataInterpreter());

module.exports = dataResolver;