'use strict';

const expect = require('../../expect');
const BadTypeError = require('../../../src/errors/BadType');

let error;

describe('BadTypeError', () => {
  describe('constructor', () => {
    it('should build an explicit message from arguments', () => {
      error = new BadTypeError(1, 'a string');
      expect(error.message).to.equal('Expected a string, got number instead');
    });
  });
});
