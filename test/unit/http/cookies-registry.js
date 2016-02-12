'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../../lib/server/app')(require('../../fixture/http/danf'), '', {environment: 'test', verbosity: 0, cluster: {active: false}})
;

danf.buildServer(function(app) {
    describe('SessionHandler', function() {
        it('should allow to get and set cookies', function(done) {
            request(app)
                .get('/cookie')
                .expect(204)
                .end(function(err, res) {
                    if (err) {
                        if (res) {
                            console.log(res.text);
                        } else {
                            console.log(err);
                        }

                        throw err;
                    }

                    done();
                })
            ;
        })
    })
});