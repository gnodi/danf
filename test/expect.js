'use strict';

/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiAsPromised);

module.exports = chai.expect;
