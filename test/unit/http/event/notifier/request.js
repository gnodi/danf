'use strict';

require('../../../../../lib/common/init');

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../../../../lib/server/app')
;

var app = danf(require(__dirname + '/../../../../fixture/http/danf'), '', {listen: false, environment: 'test', verbosity: 0});

var expectedContent = '<!DOCTYPE html><html><head><title>3 messages (3/7kB) in the topic &quot;The third world peace is near.&quot;</title></head><body><p>OMG! I can\'t believe it!,Make bombs not peace!,???</p></body></html>';

describe('Request notifier', function() {
    it('should be able to process a request', function(done) {
        request(app)
            .get('/api/forum?topic=nEws')
            .set('Accept', 'text/html')
            .expect(200, expectedContent)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect('X-Custom', 'ok')
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

    it('should resolve request parameters', function(done) {
        request(app)
            .post('/param?number=2')
            .set('Accept', 'application/json')
            .expect(201, JSON.stringify({number: 3}))
            .expect('Content-Type', 'application/json; charset=utf-8')
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

    it('should resolve request parameters', function(done) {
        request(app)
            .post('/string-param?number=2')
            .set('Accept', 'application/json')
            .expect(201, JSON.stringify({number: '21'}))
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

    it('should respond a 400 when the given parameters are wrong', function(done) {
        request(app)
            .post('/param?number=two')
            .set('Accept', 'text/*')
            .expect(400)
            .end(function(err, res) {
                if (err) {
                    if (res) {
                        console.log(res.text);
                    } else {
                        console.log(err);
                    }

                    throw err;
                }


                var expected = new RegExp('Bad Request: The expected value for ".*" is a "number"; a "string" given instead.*');

                assert(expected.test(res.text));

                done();
            })
        ;
    })

    it('should be able to process a request processing subrequests', function(done) {
        request(app)
            .get('/main')
            .set('Accept', '*/*')
            .expect(200, JSON.stringify({
                text: ['a', 'b']
            }))
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

    it('should be able to process a request processing subrequests', function(done) {
        request(app)
            .get('/main')
            .set('Accept', '*/*')
            .expect(200, JSON.stringify({
                text: ['a', 'b']
            }))
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

    it('should process request with no view', function(done) {
        request(app)
            .put('/empty')
            .set('Accept', '*/*')
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

    it('should respond a 406 if the available formats are not acceptable', function(done) {
        request(app)
            .get('/main')
            .set('Accept', 'text/plain')
            .expect(406)
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

    it('should prevent parameters injection', function(done) {
        request(app)
            .get('/injection?a=b&b=@a@')
            .set('Accept', '*/*')
            .expect(200, JSON.stringify({
                c: 'b@a@'
            }))
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