'use strict'

var Command = require('../../../lib/common/command/command'),
    ObjectProvider = require('../../../lib/common/dependency-injection/object-provider')
;

var objectProvider = new ObjectProvider();
objectProvider.class = Command;
objectProvider.debug = false;

module.exports = objectProvider;