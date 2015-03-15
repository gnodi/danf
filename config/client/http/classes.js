'use strict';

define(function(require) {
    return {
        abstractCookiesRegistry: require('../../../lib/common/http/abstract-cookies-registry'),
        cookiesRegistry: require('../../../lib/client/http/cookies-registry')
    };
});