'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../../lib/server/app')(require('../../fixture/http/danf'), '', {environment: 'test', verbosity: 0, cluster: null})
;

danf.buildServer(function(app) {
    describe('SessionHandler', function() {
        it('should allow to get and set values in session', function(done) {
            request(app)
                .get('/session/0')
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

        it('should allow to regenerate the session', function(done) {
            request(app)
                .get('/session/1')
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

        it('should allow to destroy a session', function(done) {
            request(app)
                .get('/session/2')
                .expect(500)
                .end(function(err, res) {
                    if (err) {
                        if (res) {
                            /^The session does not exist or has been destroyed\./.test(res.text);
                        } else {
                            /^The session does not exist or has been destroyed\./.test(err);
                        }

                        throw err;
                    }

                    done();
                })
            ;
        })

        it('should allow to save and reload a session', function(done) {
            request(app)
                .get('/session/3')
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