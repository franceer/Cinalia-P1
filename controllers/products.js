'use strict';

let express = require('express'),
    router = express.Router(),
    bookshelf = require('../database/database'),
    Product = require('../models/product'),
	Bookmark = require('../models/bookmark'),
    Like = require('../models/like'),
    ProductsInMovie = require('../models/products-in-video-media'),
	ProductsInLook = require('../models/products-in-look'),
    ProductsInSet = require('../models/products-in-set'), 
	_ = require('lodash');

router.get('/:id*', function (req, res, next) {	
    if (req.query.mediaid) {
        ProductsInMovie.forge({ product_id: req.params.id, video_media_id: req.query.mediaid })
		.fetch({ withRelated: ['product', 'product.brand', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', 'product.sets.videoMedia', 'videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
		.then(function (productsInMovie) {
			if(!productsInMovie){
				return ProductsInLook.forge({product_id: req.params.id})				
				.fetch({
				    withRelated: ['product', 'product.brand', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', 'product.sets.videoMedia', { 'look': function (query) {
				    query.where('video_media_id', '=', req.query.mediaid);
				}}, 'look.videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
				.then(function(productsInLook){
				    if (!productsInLook) {
				        return ProductsInSet.forge({ product_id: req.params.id })
                        .fetch({
                            withRelated: ['product', 'product.brand', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', 'product.sets.videoMedia', { 'mediaSet': function (query) {
                                    query.where('video_media_id', '=', req.query.mediaid);
                                }
                            }, 'mediaSet.videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']
                        })
                        .then(function (productsInSet) {
                            if (!productsInSet) {
                                return forgeProduct();
                            } else {
                                let jSONObject = productsInSet.toJSON();
                                return { product: jSONObject.product, contextualInfo: { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }, media: jSONObject.mediaSet.videoMedia, medias: buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks, jSONObject.product.sets) };
                            }
                        })
				    } else {
				        let jSONObject = productsInLook.toJSON();
				        return { product: jSONObject.product, contextualInfo: { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }, media: jSONObject.look.videoMedia, medias: buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks, jSONObject.product.sets) };
                    }
				})
			} else {
			    let jSONObject = productsInMovie.toJSON();
			    return { product: jSONObject.product, contextualInfo: { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }, media: jSONObject.videoMedia, medias: buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks, jSONObject.product.sets) };
			}
		})
		.then(function (builtJSON) {
		    res.locals = _.merge(res.locals, builtJSON);

		    if (req.isAuthenticated()) {
			return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'product', bookmark_id: res.locals.product.id }).fetch()
            .then(function (bookmark) {
                if (bookmark)
                    res.locals.bookmark = true;

                return Like.forge({ user_id: req.user.id, target_type: 'product', target_id: res.locals.product.id }).fetch()
                .then(function (like) {
                    return like;
                });
            });
        } else {
            return null;
        }
		})
        .then(function (like) {
            if (like)
                res.locals.like = true;

            return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['product', res.locals.product.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));
        })
        .then(function (likeCount) {
            if (likeCount && likeCount.length > 0)
                res.locals.likeCount = likeCount[0].like_count;
            if (res.locals.product.similarProducts.length === 0)
                return Product.getLastProducts(res.locals.product.id, res.locals.user);
            else
                return null;
        })
        .then(function (lastProducts) {
            if(lastProducts)
                res.locals.lastProducts = lastProducts.toJSON();
            res.render('products/products');
        })
        .catch(function(err) {
            return next(new Error(err));
        });     
	} else {
	    forgeProduct()
        .then(function (builtJSON) {
            res.locals = _.merge(res.locals, builtJSON);

            if (req.isAuthenticated()) {
                return Bookmark.forge({ user_id: req.user.id, bookmark_type: 'product', bookmark_id: res.locals.product.id }).fetch()
                .then(function (bookmark) {
                    if (bookmark)
                        res.locals.bookmark = true;

                    return Like.forge({ user_id: req.user.id, target_type: 'product', target_id: res.locals.product.id }).fetch()
                    .then(function (like) {
                        return like;
                    });
                });
            } else {
                return null;
            }
        })
        .then(function (like) {
            if (like)
                res.locals.like = true;

            return bookshelf.knex.whereRaw('target_type = ? and target_id = ?', ['product', res.locals.product.id]).from('user_likes').select(bookshelf.knex.raw('count(id) as like_count'));
        })
        .then(function (likeCount) {
            if (likeCount && likeCount.length > 0)
                res.locals.likeCount = likeCount[0].like_count;

            if (res.locals.product.similarProducts.length === 0)
                return Product.getLastProducts(res.locals.product.id, res.locals.user);
            else
                return null;
        })
        .then(function (lastProducts) {
            if(lastProducts)
                res.locals.lastProducts = lastProducts.toJSON();

            res.render('products/products');
        })
        .catch(function (err) {
            return next(new Error(err));
        });      
	}	

	function buildVideoMediaCollection(productVideoMedias, looks, sets){
	    let videoMedias = productVideoMedias;
		_.forEach(looks, function (look) {
			videoMedias.push(look.videoMedia);
		});

		_.forEach(sets, function (set) {
		    videoMedias.push(set.videoMedia);
		});
		videoMedias = _.uniqBy(videoMedias, 'id');
		return videoMedias;
	}

	function forgeProduct() {
	    return Product.forge({ id: req.params.id })
		.fetch({ withRelated: ['brand', 'categories', 'videoMedias', 'looks.videoMedia', 'similarProducts', 'similarProducts.brand'], require: true })
		.then(function (product) {
		    let jSONObject = product.toJSON();
		    return { product: jSONObject, medias: buildVideoMediaCollection(jSONObject.videoMedias, jSONObject.looks) };
		});
	}
});

module.exports = router