/**
 * Created by Dmitry on 17.12.2015.
 */
var express = require('express');
var Review = require('./../models/review.js');

var router = express.Router();

module.exports = function (app, auth) {
    /* Get list of products */
    /* localhost:8888/review/id */
    router.get('/:product_id', auth, function (req, res) {
        Review.find({product_id: req.params.product_id}, function(err, reviewsList){
            if( err ) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            return res.send({
                success: true,
                data: reviewsList
            });
        });
    });

    router.post('/:product_id', auth, function (req, res) {
        var review = new Review({
            user_id: req.user._id,
            product_id: req.params.product_id,
            description: req.body.description,
            date: Date.now()
        });
        
        review.save(function(err){
            if (err) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            return res.send({
                success: true,
                data: review
            });
        })
    });

    router.delete('/:review_id', auth, function (req, res) {
        Review.findByIdAndRemove(req.params.review_id, function(err){
            if (err) {
                return res.send({
                    success: false,
                    err: err
                });
            }
            return res.send({
                success: true
            });
        });
    });

    return router;
};