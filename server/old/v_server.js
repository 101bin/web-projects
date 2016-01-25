var express = require('express');
var app = express();
var fs = require('fs')
var bodyParser = require('body-parser');
var data = {title: 'Hello, world!'};
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/blog', function(req, res) {
    res.render('test.ejs', data);
});

app.get('/', function(req, res) {
    res.render('index.html');
});


var databaseUrl = "db";
var collections = ["users"];
var mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);
app.post('/reg', function(req, res) {
    console.log(req.body.test);
    req.send(req.body.test);
});
app.listen(8080);
console.log("Listen");
