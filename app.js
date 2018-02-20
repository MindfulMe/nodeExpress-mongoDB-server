var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
var db = mongojs('mongodb://MapInc:q565602qw@ds143388.mlab.com:43388/users3342',['tasks']);

var port = process.env.PORT
var ObjectId = mongojs.ObjectId;

var app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//set Static path for things like server, css files, angular app, etc
app.use(express.static(path.join(__dirname, "public")));

//setup global variables
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

app.use(expressValidator());﻿

app.get("/", function(req, res){
  db.users.find(function(err, docs){

  res.render("index", {
    title: "Customers",
    users: docs
  });
  });
});

app.post("/", function(req, res){

  req.checkBody("firstName", "first name is required").notEmpty();
  req.checkBody("lastName", "last name is required").notEmpty();
  req.checkBody("email", "email is required").notEmpty();

  var errors = req.validationErrors();

  if(errors){
    db.users.find(function (err, users) {
    res.render("index", {
      title: "Customers",
      users: users,
      errors: errors
    });
  });
}
 else {
var newUser = {
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email
};
db.users.insert(newUser);
res.redirect("/");
  }
});

app.delete('/users/delete/:id', function(req, res){
db.users.remove({_id: ObjectId(req.params.id)});
res.redirect('/');
})

app.listen(port, function(){
    console.log("Express App Started");
});
