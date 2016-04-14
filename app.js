//Set Modules & variables
var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , port = process.env.PORT || 3000;

//App configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//app.use(function (req, res, next) {
//    res.setHeader('charset', 'utf-8');
//    next();
//});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./controllers'));

//Listen to port
app.listen(port, function () {
    console.log('Listening on port ' + port);
});