var express = require('express'),
	router = express.Router(),
    Character = require('../../models/media-character');
  
router.get('/', function (req, res) {
    Character.searchCharacters(req.query.q, req.query.page)
    .then(function (results) {
        var jSONResults = results.toJSON();
        var data = [];

        jSONResults.forEach(function (character) {
            data.push({ id: character.id, text: character.firstname + (character.lastname ? ' ' + character.lastname : '') });
        });
        res.json({ items: data, total_count: results.pagination.rowCount });
    });
})
.post('/', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
        if (req.body[key] === '')
            req.body[key] = null;
    });

    Character.create(req.body)
    .then(function (character) {
        res.json({ status: 'success', object: character.toJSON() });
    })
    .catch(function (err) {
        res.json({ status: 'error', message: err.message });
    });
});

module.exports = router;