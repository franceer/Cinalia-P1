var express = require('express'),
	router = express.Router(),
    Category = require('../../models/category');
  
router.get('/', function (req, res) {
    Category.searchCategories(req.query.q, req.query.page)
    .then(function (results) {
        var jSONResults = results.toJSON();
        var data = [];

        jSONResults.forEach(function (category) {
            data.push({ id: category.id, text: category.name + '(' + category.path + ')' });
        });
        res.json({ items: data, total_count: results.pagination.rowCount });
    });
})
.post('/', function (req, res) {    
    Category.findOne({ path: req.body.path }, { require: false })
    .then(function (category) {
        if(!category)
        {
            Category.create(req.body)
            .then(function (category) {
                res.json({ status: 'success', object:  category.toJSON()});
            });
        } else {
            res.json({status: 'error', message: 'Le chemin de la catégorie existe déjà.'});
        }
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;