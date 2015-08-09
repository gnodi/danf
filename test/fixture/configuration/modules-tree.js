'use strict';

var ModulesTree = require('../../../lib/common/configuration/modules-tree');

var modulesTree = new ModulesTree('app');

modulesTree.build(require('./danf'));

module.exports = modulesTree;