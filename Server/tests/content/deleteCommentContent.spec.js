/* eslint-disable sort-keys */
/* eslint-disable guard-for-in */
/*eslint max-statements: ["error", 20]*/
/* eslint multiline-comment-style: ["error", "starred-block"] */

// --- Requirements --- //
var app = require('../../app');
var chai = require('chai');
var config = require('../../api/config/config');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var Content = mongoose.model('Content');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
// --- End of 'Requirements' --- //

// --- Dependancies --- //
var expect = chai.expect;
var mockgoose = new Mockgoose(mongoose);
// --- End of 'Dependancies' --- //

// --- Middleware --- //
chai.use(chaiHttp);
// --- End of 'Middleware' --- //

// Objects variables for testing
var normalUser = null;
var adminUser = null;
var commentCreatorUser = null;
var replyCreatorUser = null;
var pendingContent = null;
var contentCreatorUser = null;
var approvedContent = null;

describe('Contents Comments/replies deletion', function () {

    /*
     * Tests for GET content both list and detail
     *
     * @author: Wessam
     */

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {

                done();
            });
        });
    });
    // --- End of 'Mockgoose Initiation' --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            // Creating data for testing
            Content.create({
                approved: false,
                body: '<h1>Hello</h1>',
                category: 'cat1',
                creator: 'username',
                section: 'sec1',
                title: 'Test Content',
                discussion: [
                    {
                        creator: 'dummyUser',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text'
                            }
                        ]
                    }
                ]
            }, function (err, content) {
                if (err) {
                    console.log(err);
                }
                pendingContent = content;
            });
            Content.create({
                approved: true,
                body: '<h1>Hello</h1>',
                category: 'cat1',
                creator: 'username',
                section: 'sec1',
                title: 'Test Content',
                discussion: [
                    {
                        creator: 'dummyUser',
                        text: 'comment text',
                        replies: [
                            {
                                creator: 'dummyUser',
                                text: 'reply text'
                            }
                        ]
                    }
                ]
            }, function (err, content) {
                if (err) {
                    console.log(err);
                }
                approvedContent = content;
            });
            User.create({
                birthdate: Date.now(),
                email: 'test0@email.com',
                firstName: 'firstname',
                isAdmin: false,
                lastName: 'lastname',
                password: 'password',
                phone: '0111111111',
                username: 'normalusername'
            }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                normalUser = user;
                User.create({
                    birthdate: Date.now(),
                    email: 'test1@email.com',
                    firstName: 'firstname',
                    isAdmin: true,
                    lastName: 'lastname',
                    password: 'password',
                    phone: '0111111111',
                    username: 'adminusername'
                }, function (err2, user2) {
                    if (err2) {
                        console.log(err2);
                    }
                    adminUser = user2;
                    User.create({
                        birthdate: Date.now(),
                        email: 'test1@email.com',
                        firstName: 'firstname',
                        isAdmin: true,
                        lastName: 'lastname',
                        password: 'password',
                        phone: '0111111111',
                        username: 'commentCreatorUser'
                    }, function (err3, user3) {
                        if (err3) {
                            console.log(err3);
                        }
                        commentCreatorUser = user3;
                        User.create({
                            birthdate: Date.now(),
                            email: 'test1@email.com',
                            firstName: 'firstname',
                            isAdmin: true,
                            lastName: 'lastname',
                            password: 'password',
                            phone: '0111111111',
                            username: 'contentCreatorUser'
                        }, function (err4, user4) {
                            if (err4) {
                                console.log(err4);
                            }
                            contentCreatorUser = user4;
                            User.create({
                                birthdate: Date.now(),
                                email: 'test1@email.com',
                                firstName: 'firstname',
                                isAdmin: true,
                                lastName: 'lastname',
                                password: 'password',
                                phone: '0111111111',
                                username: 'replyCreatorUser'
                            }, function (err5, user5) {
                                if (err5) {
                                    console.log(err4);
                                }
                                replyCreatorUser = user5;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    // --- End of 'Clearing Mockgoose' --- //

    describe('/Deleting comments from contents', function () {

        /*
         * Tests for deleting comments from contents
         *
         * @author: Wessam
         */

        it('it should delete comment by comment creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': commentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete comment by content creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': contentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete comment by admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should return 403 for normal user', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(403);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 401 for unverified user', function (done) {
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(401);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion.length).to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for wrong content id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent.discussion[0]._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);

                    done();
                });
        });
        it('it should return 404 for wrong comment id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);

                    done();
                });
        });
        it('it should delete reply by reply creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by comment creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': commentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by content creator', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': contentCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should delete reply by admin', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': adminUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(204);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(0);
                            done();
                        }
                    );
                });
        });
        it('it should return 403 for normal user', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': normalUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(403);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 401 for unverified user', function (done) {
            chai.request(app).
                delete('/api/content/' +
                    approvedContent._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(401);

                    Content.findById(
                        approvedContent._id,
                        function (err2, content) {
                            if (err2) {
                                console.log(err2);
                            }
                            expect(content.discussion[0].replies.length).
                                to.equal(1);
                            done();
                        }
                    );
                });
        });
        it('it should return 404 for wrong content id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent.discussion[0]._id +
                    '/comments/' +
                    approvedContent.discussion[0]._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 404 for wrong comment id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent.discussion[0]._id +
                    '/comments/' +
                    approvedContent._id +
                    '/replies/' +
                    approvedContent.discussion[0].replies[0]._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
                });
        });
        it('it should return 404 for wrong reply id', function (done) {
            var token = 'JWT ' + jwt.sign(
                { 'id': replyCreatorUser._id },
                config.SECRET,
                { expiresIn: '12h' }
            );
            chai.request(app).
                delete('/api/content/' +
                    approvedContent.discussion[0]._id +
                    '/comments/' +
                    approvedContent._id +
                    '/replies/' +
                    approvedContent._id).
                set('Authorization', token).
                end(function (err, res) {
                    if (err) {
                        console.log(err);
                    }

                    res.should.have.status(404);
                    done();
                });
        });
    });
    // --- Clearing Mockgoose --- //
    after(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //

    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
});
