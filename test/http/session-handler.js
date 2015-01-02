'use strict';

require('../../lib/init');

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../lib/app')
;

var app = danf(require(__dirname + '/../fixtures/http/danf'), {listen: false, environment: 'test'});

describe('Request notifier', function() {
    it('should be able to process a request', function(done) {
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

    it('should be able to process a request', function(done) {
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

    it('should be able to process a request', function(done) {
        request(app)
            .get('/session/2')
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