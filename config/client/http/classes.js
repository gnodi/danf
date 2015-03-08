'use strict';

define(function(require) {
    return {
        abstractCookiesRegistry: require('-/danf/lib/common/http/abstract-cookies-registry'),
        cookiesRegistry: require('-/danf/lib/client/http/cookies-registry')
    };
});