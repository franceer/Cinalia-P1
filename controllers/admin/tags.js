var express = require('express'),
	router = express.Router(),
    Tag = require('../../models/tag');
  
router.get('/', function (req, res) {
    Tag.searchTags(req.query.q, req.query.page)
    .then(function (results) {
        var jSONResults = results.toJSON();
        var data = [];

        jSONResults.forEach(function (tag) {
            data.push({ id: tag.id, text: tag.name + '(' + tag.path + ')' });
        });
        res.json({ items: data, total_count: results.pagination.rowCount });
    });
})
.post('/', function (req, res) {    
    Tag.findOne({ path: req.body.path }, { require: false })
    .then(function (tag) {
        if (!tag)
        {
            Tag.create(req.body)
            .then(function (tag) {
                res.json({ status: 'success', object: tag.toJSON() });
            });
        } else {
            res.json({status: 'error', message: 'Le chemin du tag existe déjà.'});
        }
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;