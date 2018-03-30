var mongoose = require('mongoose');
var Content = mongoose.model('Content');
var ObjectIdValidator = require('../utils/validators/is-object-id');

module.exports.getNumberOfContentPages = function (req, res, next) {
    if (req.params.category !== 'NoCat' &&
        req.params.section !== 'NoSec') {
        Content.find({
            category: req.params.category,
            section: req.params.section
        }).count().
            exec(function (err, count) {
                console.log('EntriesPerPage: ' +
                    Number(req.params.numberOfEntriesPerPage));
                console.log(count);
                var numberOfPages =
                    Math.
                        ceil(Number(count) /
                            Number(req.params.numberOfEntriesPerPage));

                console.log('Number of Pages: ' + numberOfPages);
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: numberOfPages,
                    err: null,
                    msg: 'Number of pages was retrieved'
                });
            });
    } else if (req.params.category === 'NoCat') {
        Content.find().count().
        exec(function (err, count) {
            var numberOfPages =
                Math.ceil(count / req.params.numberOfEntriesPerPage);

            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: numberOfPages,
                err: null,
                msg: 'Number of pages was retrieved'
            });
        });
    } else {
        Content.find({ category: req.params.category }).count().
            exec(function (err, count) {
                var numberOfPages =
                    Math.ceil(count / req.params.numberOfEntriesPerPage);

                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: numberOfPages,
                    err: null,
                    msg: 'Number of pages was retrieved'
                });
            });
    }
};

module.exports.getContentPage = function (req, res, next) {
    var pageNumber = Number(req.params.pageNumber);
    var numberOfEntriesPerPage = Number(req.params.numberOfEntriesPerPage);
    if (req.params.category !== 'NoCat' && req.params.section !== 'NoSec') {
        Content.find({
            category: req.params.category,
            section: req.params.section
        }).skip((pageNumber - 1) * numberOfEntriesPerPage).
            limit(numberOfEntriesPerPage).
            exec(function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });
            });
    } else if (req.params.category === 'NoCat') {
        Content.find().skip((pageNumber - 1) * numberOfEntriesPerPage).
            limit(numberOfEntriesPerPage).
            exec(function (err, contents) {
                if (err) {
                    return next(err);
                }

                return res.status(200).json({
                    data: contents,
                    err: null,
                    msg: 'Page retrieved successfully'
                });
            });
    } else {
        Content.find({ category: req.params.category }).
        skip((pageNumber - 1) * numberOfEntriesPerPage).
        limit(numberOfEntriesPerPage).
        exec(function (err, contents) {
            if (err) {
                return next(err);
            }

            return res.status(200).json({
                data: contents,
                err: null,
                msg: 'Page retrieved successfully'
            });
        });
    }
};

// TODO: manage permissions specific behavior for content creation
module.exports.createContent = function (req, res, next) {
    var valid = req.body.title &&
        req.body.body &&
        req.body.category &&
        req.body.section;
    if (!valid) {
        return res.status.json({
            data: null,
            err: 'content metadata not supplied',
            msg: null
        });
    }
    delete req.body.touchDate;
    Content.create(req.body, function (err, content) {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            data: content,
            err: null,
            msg: 'Content was created successfully'
        });
    });


};

module.exports.getContentById = function (req, res, next) {

    try {
        ObjectIdValidator.isObjectId(req.params.id);
    } catch (error) {

        return res.status(422).json({
            data: null,
            err: 'The Content Id is not valid.',
            msg: null
        });
    }

    Content.findById(req.params.id).exec(function (err, content) {
        if (err) {
            return next(err);
        }

        if (!content) {
            return res.status(404).json({
                data: null,
                err: 'The requested product was not found.',
                msg: null
            });
        }

        return res.status(200).json({
            data: content,
            err: null,
            msg: 'Content was retrieved successfully'
        });

    });

};
