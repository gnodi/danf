'use strict';

var DataResolver = require('../../../lib/common/manipulation/data-resolver'),
    DefaultDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/default'),
    RequiredDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/required'),
    TypeDataInterpreter = require('../../../lib/common/manipulation/data-interpreter/type'),
    ReferencesDataInterpreter = require('../../../lib/common/configuration/data-interpreter/references'),
    NamespacesDataInterpreter = require('../../../lib/common/configuration/data-interpreter/namespaces')
;

var configurationResolver = new DataResolver();

configurationResolver.addDataInterpreter(new DefaultDataInterpreter());
configurationResolver.addDataInterpreter(new RequiredDataInterpreter());
configurationResolver.addDataInterpreter(new TypeDataInterpreter());
configurationResolver.addDataInterpreter(new ReferencesDataInterpreter());
configurationResolver.addDataInterpreter(new NamespacesDataInterpreter());

module.exports = configurationResolver;