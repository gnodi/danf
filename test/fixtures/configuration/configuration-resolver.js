'use strict';

var DataResolver = require('../../../lib/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../../../lib/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/manipulation/data-interpreter/type'),
    ReferencesDataInterpreter = require('../../../lib/configuration/data-interpreter/references'),
    NamespacesDataInterpreter = require('../../../lib/configuration/data-interpreter/namespaces')
;

var configurationResolver = new DataResolver();

configurationResolver.addDataInterpreter(new DefaultDataInterpreter());
configurationResolver.addDataInterpreter(new RequiredDataInterpreter());
configurationResolver.addDataInterpreter(new TypeDataInterpreter());
configurationResolver.addDataInterpreter(new ReferencesDataInterpreter());
configurationResolver.addDataInterpreter(new NamespacesDataInterpreter());

module.exports = configurationResolver;