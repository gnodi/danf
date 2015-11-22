'use strict';

module.exports = CookieTester;

function CookieTester() {
};

CookieTester.prototype.process = function() {
    var foo = this._cookiesRegristry.get('foo');

    if ('undefined' !== typeof document) {
        if (foo === 'bar') {
            document.write('--- SUCCESS ---');
        } else if (foo) {
            document.write('--- ERROR ---');
        }

        this._cookiesRegristry.unset('foo');
    } else {
        this._cookiesRegristry.set('foo', 'bar');
    }
};