'use strict';

let express = require('express'),
    router = express.Router(),
    bookshelf = require('../database/database'),
    Product = require('../models/product'),
    ProductCategory = require('../models/product-category'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let catID = req.query.cat;
    let currentPage = req.query.page;
    let categoryName = '';

    if (catID) {
        ProductCategory.findById(catID).then(function (category) {
            categoryName = category.get('name');
            return Product.query(function (qb) {
				qb.join('brands', 'brands.id', '=', 'products.brand_id');
                qb.join('product_categories_products as pcp', 'products.id', '=', 'pcp.product_id');
                qb.join('product_categories as pc', 'pcp.product_category_id', '=', 'pc.id');
                qb.where('pc.path', '~', '*.' + category.get('path') + '.*');
                qb.select(bookshelf.knex.raw('products.id, \'<span>\' || brands.name || \'</span> \' || products.name  as name, products.description, products.picture_url, products.picture_alt, products.picture_title, \'products\' as section_url'));
            })
           .fetchPage({
               pageSize: 20,
               page: parseInt(currentPage) ? parseInt(currentPage) : 1
           });
        })       
        .then(function (results) {
            res.render('search/search', { results: results.toJSON(), pagination: results.pagination, categoryName: categoryName });
        }).catch(function (err) {
            throw new Error(err);
        });
    } else {
        let query = decodeURIComponent(req.query.q).replace(/[^a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]/g, ' ').replace(/\s\s+/g, ' ').trim().replace(/ /g, '|');
        bookshelf.knex.whereRaw('tsv @@ to_tsquery(unaccent(?))', [query]).from('document_search_mview').select(bookshelf.knex.raw('id, name, description, picture_url, picture_alt, picture_title, section_url, ts_rank(tsv, to_tsquery(unaccent(\'' + query + '\'))) as rank')).orderBy('rank', 'desc')
        .then(function (results) {
            res.render('search/search', { keywords : query, results: results, pagination: {page: 1, pageSize: 100, pageCount: 1, rowCount: results.length} });
        })
        .catch(function (err) {
            throw new Error(err);
        });
    }
});

module.exports = router