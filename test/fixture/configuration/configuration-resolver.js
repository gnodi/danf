'use strict';

var DataResolver = require('../../../lib/common/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/type'),
    ReferencesDataInterpreter = require('../../../lib/common/configuration/manipulation/data-interpreter/references'),
    NamespaceDataInterpreter = require('../../../lib/common/configuration/manipulation/data-interpreter/namespace')
;

var configurationResolver = new DataResolver();

configurationResolver.addDataInterpreter(new DefaultDataInterpreter());
configurationResolver.addDataInterpreter(new RequiredDataInterpreter());
configurationResolver.addDataInterpreter(new TypeDataInterpreter());
configurationResolver.addDataInterpreter(new ReferencesDataInterpreter());
configurationResolver.addDataInterpreter(new NamespaceDataInterpreter());

module.exports = configurationResolver;