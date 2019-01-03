'use strict';

const expect = require('../../expect');
const MissingImplementationError = require('../../../src/errors/MissingImplementation');

let error;
class Foo {
}
const foo = new Foo();

describe('MissingImplementationError', () => {
  describe('constructor', () => {
    it('should build an explicit message from arguments', () => {
      error = new MissingImplementationError(foo, 'bar');
      expect(error.message).to.equal('\'bar\' method must be implemented by \'Foo\'');
    });
  });
});
