'use strict';

module.exports = CookieTester;

function CookieTester() {
};

CookieTester.defineImplementedInterfaces(['danf:ajaxApp.processor']);

CookieTester.prototype.process = function() {
    var foo = this._cookiesRegristry.get('foo');

    if (foo === 'bar') {
        document.write('--- SUCCESS ---');
    } else if (foo) {
        document.write('--- ERROR ---');
    }

    this._cookiesRegristry.unset('foo');
};