var express = require('express'),
    router = express.Router(),
    VideoMedia = require('../../models/video-media'),
    MediaGenre = require('../../models/media-genre'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    moment = require('moment');

router.get('/', function (req, res) {
    MediaGenre.fetchAll()
    .then(function (genres) {
        res.locals.genres = genres.toJSON();
        return VideoMedia.fetchPage({ pageSize: 50, page: 1, withRelated: ['mediaGenre'] });
    })
    .then(function (videoMedias) {
        res.render('admin/movies', { videoMedias: videoMedias.toJSON(), moment: moment });
    });    
})
.put('/:id', function (req, res) {
    VideoMedia.update(req.body, { id: req.params.id })
    .then(function (videoMedia) {
        return videoMedia.load('mediaGenre');
    })
    .then(function (videoMedia) {
        res.json(videoMedia.toJSON());
    })
    .catch(function (err) {
        res.send(err.message);
    });
})
.post('/', function (req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;
    console.log(process.cwd());
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/upload');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
});

module.exports = router;