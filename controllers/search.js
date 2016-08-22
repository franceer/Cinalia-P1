'use strict';

let express = require('express'),
    router = express.Router(),
    bookshelf = require('../database/database'),
    Product = require('../models/product'),
    Category = require('../models/category'),
    helper = require('../helpers/helper'),
    _ = require('lodash');

router.get('/', function (req, res) {
    let catID = req.query.cat;
    let currentPage = req.query.p;
    let categoryName = '';

    if (catID) {
        Category.findById(catID).then(function (category) {
            res.locals.categoryName = category.get('name');
            res.locals.catID = catID;
            let categoryPath = category.get('path');
            let elementToQuery;

            _.forEach(Category.getAssetsByCategoryPath(categoryPath), function (value, key) {
                if (categoryPath.includes(key)) {
                    elementToQuery = value;
                    return false;
                }
            });

            return elementToQuery()
            .fetchPage({
                pageSize: 2,
                page: parseInt(currentPage) ? parseInt(currentPage) : 1
            });            
        })
        .then(function (results) {
            results.pagination.data = helper.getPaginationData(results.pagination.rowCount, results.pagination.pageSize, 10, results.pagination.page);
            res.render('search/search', { results: results.toJSON(), pagination: results.pagination });
        }).catch(function (err) {
            throw new Error(err);
        });
    } else {
        let query = decodeURIComponent(req.query.q).replace(/[^a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]/g, ' ').replace(/\s\s+/g, ' ').trim().replace(/ /g, '|');
        bookshelf.knex.whereRaw('tsv @@ to_tsquery(unaccent(?))', [query]).from('document_search_mview').select(bookshelf.knex.raw('id, name, description, picture_url, picture_alt, picture_title, section_url, ts_rank(tsv, to_tsquery(unaccent(\'' + query + '\'))) as rank')).orderBy('rank', 'desc')
        .then(function (results) {
            res.render('search/search', { keywords: query, results: results, pagination: { page: 1, pageSize: 100, pageCount: 1, rowCount: results.length } });
        })
        .catch(function (err) {
            throw new Error(err);
        });
    }
});

module.exports = router