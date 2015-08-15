'use strict'

var Map = require('../../../lib/common/manipulation/map'),
    ObjectProvider = require('../../../lib/common/dependency-injection/object-provider')
;

var objectProvider = new ObjectProvider();
objectProvider.class = Map;
objectProvider.debug = false;

module.exports = objectProvider;