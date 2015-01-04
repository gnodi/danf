'use strict';

require('../../lib/init');

var assert = require('assert'),
    request = require('supertest'),
    danf = require('../../lib/app')
;

var app = danf(require(__dirname + '/../fixtures/http/danf'), {listen: false, environment: 'test'});

// Use.
app.useBeforeRouting = function () {
    this.use(function(req, res, next) {
        var dom = domain.create();

        domain.active = dom;
        dom.add(req);
        dom.add(res);

        dom.on('error', function(err) {
            req.next(err);
        });
        res.on('end', function() {
           dom.dispose();
        });

        dom.run(next);
    });

    this.use(cookieParser());
    this.use(session({
        secret: context.secret,
        cookie: {},
        resave: true,
        saveUninitialized: true,
        genid: function() {
            return '1';
        }
    }));
};

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