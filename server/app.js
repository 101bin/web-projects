var express = require('express');
var app = express();
var fs = require('fs')
var bodyParser = require('body-parser');
var session = require('express-session');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".html",require('ejs').renderFile);
app.use(session({secret:'thebestblog', cookie: {maxAge: 60*60*1000}}));

var databaseUrl = "db";
var collections = ["users","messages","comments"];
var mongojs = require("mongojs");
var db = mongojs(databaseUrl, collections);
app.post('/reg', function(req, res) {
    console.log(req.body);
    db.users.find({username:req.body.username}, function(err, value){
        console.log(err);
        console.log(value);
        if (err) {
            
        } else {
            if (value.length) {
                res.send("fail");
            } else {
                db.users.save(req.body);
                console.log("Saved new entity " + req.body);
                res.send("OK");
            }
        }
    });
});
app.post('/enter', function(req, res) {
    var sess = req.session;
    console.log(req.body);
    var body;
    db.users.find({username:req.body.username,password:req.body.hpass,email:req.body.email},function(err, value){
        console.log(value);
        if (!err) {
            if (!value.length) {
                res.render('error.ejs', req.body);
            } else {
                body = value[0];
                db.messages.find({},function(err, value){
                    console.log(value);
                    if (!err) {
                        sess.username = req.body.username;
                        sess.auth = true;
                        body.messages = value;
                        db.comments.find({}, function(err, value){
                            if (!err) {
                                var comments = {};
                                for(var obj in value) {
                                    if (value[obj].post in comments) {
                                        comments[value[obj].post].push(value[obj]);
                                    } else {
                                        comments[value[obj].post] = [value[obj]];
                                    }
                                }
                                body.comments = comments;
                                console.log(comments);
                                res.render('blog.ejs',body);
                                res.end();
                            }
                        });
                    }
                });
            }
        }
    });
});
app.post('/message', function(req, res){
    if (req.session.auth) {
        console.log(req.body);
        db.messages.save(req.body);
        db.messages.find(req.body, function(err, val) {
            if (!err) {
                console.log(val[0]._id);
                res.send(val[0]._id);
                res.end();
            }
        });
    } else {
        res.redirect("index.html");
        res.end();
    }
});
app.post('/comment', function(req, res){
    if (req.session.auth) {
        console.log("comment");
        console.log(req.body);
        db.comments.save(req.body);
        res.end();
    } else {
        res.redirect("index.html");
        res.end();
    }
});
app.get('/logout', function(req, res){
    if (req.session.auth) {
        req.session.ayth = false;
        req.session.destroy(function(err){
            if (err) {
                console.log(err);
            } else {
                res.redirect("index.html");
                //res.sendFile(__dirname + '/public/index.html');
            }
        });
    } else {
        console.log("No auth man");
    }
});
app.listen(8080);
console.log("Listen");
