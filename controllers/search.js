'use strict';

let express = require('express'),
    router = express.Router(),
    bookshelf = require('../database/database'),
    Product = require('../models/product'),
    Bookmark = require('../models/bookmark'),
    Category = require('../models/category'),
    helper = require('../helpers/helper'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let catID = req.query.cat;
    let currentPage = req.query.p ? req.query.p : 1;
    let categoryName = '';

    if (catID) {
        Category.findById(catID).then(function (category) {            
            res.locals.categoryName = category.get('name');
            res.locals.catID = catID;
            let categoryPath = category.get('path');
            let elementToQuery;

            _.forEach(Category.getAssetsByCategoryPath(categoryPath, res.locals.user), function (value, key) {
                if (categoryPath.includes(key)) {
                    elementToQuery = value;
                    return false;
                }
            });

            return elementToQuery()
            .fetchPage({
                pageSize: 20,
                page: parseInt(currentPage)
            });            
        })
        .then(function (results) {            
            results.pagination.data = helper.getPaginationData(results.pagination.rowCount, results.pagination.pageSize, 10, results.pagination.page);
            res.render('search/search', { results: results.toJSON(), pagination: results.pagination });            
        }).catch(function (err) {
            res.locals.categoryName = 'Catégorie introuvable';
            res.locals.catID = catID;
            res.render('search/search', { results: {}, pagination: {} });
        });
    } else {        
        var limit = 20
        var offset = (currentPage - 1) * limit;
        let query = decodeURIComponent(req.query.q).replace(/[^a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]/g, ' ').replace(/\s\s+/g, ' ').trim().replace(/ /g, '|');
        bookshelf.knex.whereRaw('tsv @@ to_tsquery(unaccent(?))', [query])
        .from('document_search_mview')
        .select(bookshelf.knex.raw('id, count(*) OVER() as full_count, name, description, picture_url, picture_alt, picture_title, section_url, type, ts_rank(tsv, to_tsquery(unaccent(\'' + query + '\'))) as rank'))
        .orderBy('rank', 'desc')
        .limit(limit)
        .offset(offset)
        .then(function (results) {
            var rowCount = results.length > 0 ? results[0].full_count : 0;

            var pagination = {
                data: helper.getPaginationData(rowCount, limit, 10, currentPage),
                page: currentPage, 
                pageSize: limit, 
                pageCount: Math.ceil(rowCount/limit), 
                rowCount: rowCount
            };

            if(res.locals.user && results.length > 0)
                Bookmark.areBookmarked(results, res.locals.user)
                .then(function (results) {
                    res.render('search/search', { keywords: req.query.q, results: results, pagination: pagination });
                });
            else
                res.render('search/search', { keywords: req.query.q, results: results, pagination: pagination });
        })
        .catch(function (err) {
            throw new Error(err);
        });
    }
});

module.exports = router