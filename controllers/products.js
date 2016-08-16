'use strict';

let express = require('express'),
    router = express.Router(),
    bookshelf = require('../database/database'),
    Product = require('../models/product'),
    ProductsInMovie = require('../models/products-in-video-media'),
	ProductsInLook = require('../models/products-in-look'), 
	_ = require('lodash');

router.get('/:id', function (req, res, next) {	
    //if (req.query.movieid) {
    //    ProductsInMovie.forge({ product_id: req.params.id, video_media_id: req.query.movieid })
    //    .fetch({ withRelated: ['product', 'product.brand', 'product.type', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', 'videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
    //    .then(function (productsInMovie) {
	//		if(!productsInMovie){
	//			ProductsInLook.forge({product_id: req.params.id})				
	//			.fetch({ withRelated: ['product', 'product.brand', 'product.type', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', {'look': function(query){
	//				query.where('video_media_id', '=', req.query.movieid);
	//			}}, 'look.videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
	//			.then(function(productsInLook){
	//				if(!productsInLook){
	//					forgeProduct();
	//				}else{					
	//					let jSONObject = productsInLook.toJSON();
	//					let videoMedias = buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks);		
	//					let contextualInfo = {matchingStatus : jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }
	//					res.render('products/products', { product: jSONObject.product, contextualInfo: contextualInfo, media: jSONObject.look.videoMedia, medias: videoMedias });
	//				}
	//			})				
	//			.catch(function(err) {
	//				return next(new Error(err));
	//			}); 
	//		}else{            
	//			let jSONObject = productsInMovie.toJSON();
	//			let videoMedias = buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks);				
	//			let contextualInfo = {matchingStatus : jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }
	//			res.render('products/products', { product: jSONObject.product, contextualInfo: contextualInfo, media: jSONObject.videoMedia, medias: videoMedias });
	//		}
    //    })
	//	.catch(function(err) {
	//		return next(new Error(err));
	//	});         
	//}else{
	//	forgeProduct();
	//}
	
	if (req.query.movieid) {
		ProductsInMovie.forge({ product_id: req.params.id, video_media_id: req.query.movieid })
		.fetch({ withRelated: ['product', 'product.brand', 'product.type', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', 'videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
		.then(function (productsInMovie) {
			if(!productsInMovie){
				ProductsInLook.forge({product_id: req.params.id})				
				.fetch({ withRelated: ['product', 'product.brand', 'product.type', 'product.categories', 'product.videoMedias', 'product.looks.videoMedia', {'look': function(query){
					query.where('video_media_id', '=', req.query.movieid);
				}}, 'look.videoMedia', 'matchingStatus', 'product.similarProducts', 'product.similarProducts.brand']})
				.then(function(productsInLook){
					if(!productsInLook){
						return forgeProduct();
					} else {
					    let jSONObject = productsInLook.toJSON();
					    return { product: jSONObject.product, contextualInfo: { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }, media: jSONObject.look.videoMedia, medias: buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks) };
					}
				})
			} else {
			    let jSONObject = productsInMovie.toJSON();
			    return { product: jSONObject.product, contextualInfo: { matchingStatus: jSONObject.matchingStatus, appearingContext: jSONObject.appearing_context }, media: jSONObject.videoMedia, medias: buildVideoMediaCollection(jSONObject.product.videoMedias, jSONObject.product.looks) };
			}
		})
		.then(function (builtJSON) {
		    res.render('products/products', builtJSON);
		})
        .catch(function(err) {
            return next(new Error(err));
        });     
	} else {
	    forgeProduct()
        .then(function (builtJSON) {
            res.render('products/products', builtJSON);
        })
        .catch(function (err) {
            return next(new Error(err));
        });
	}	

	function buildVideoMediaCollection(coll1, coll2){
		let videoMedias = coll1;
		_.forEach(coll2, function(look){
			videoMedias.push(look.videoMedia);
		});
		videoMedias = _.uniqBy(videoMedias, 'id');
		return videoMedias;
	}

	function forgeProduct() {
	    return Product.forge({ id: req.params.id })
		.fetch({ withRelated: ['brand', 'type', 'categories', 'videoMedias', 'looks.videoMedia', 'similarProducts', 'similarProducts.brand'], require: true })
		.then(function (product) {
		    let jSONObject = product.toJSON();
		    return { product: jSONObject, medias: buildVideoMediaCollection(jSONObject.videoMedias, jSONObject.looks) };
		});
	}
	
	//function forgeProduct(){
	//	Product.forge({ id: req.params.id })
	//	.fetch({ withRelated: ['brand', 'type', 'categories', 'videoMedias', 'looks.videoMedia', 'similarProducts', 'similarProducts.brand'], require: true })
	//	.then(function (product) {
	//		let jSONObject = product.toJSON();
	//		let videoMedias = buildVideoMediaCollection(jSONObject.videoMedias, jSONObject.looks);				
	//		res.render('products/products', { product: product.toJSON(), medias: videoMedias });
	//	})	
	//	.catch(bookshelf.NotFoundError, function (err) {
	//		res.status(404).send("Not Found");
	//	})
	//	.catch(function(err) {
	//		return next(new Error(err));
	//	});		
	//}	
});

module.exports = router