//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));


app.use(express.static('public'));

app.set("view engine" , "ejs");


// mongoose 

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password: String
})

var secret =  process.env.SECRET;

userSchema.plugin(encrypt , {secret : secret , encryptedFields: ['password']})
const User = new mongoose.model("user" , userSchema);

app.get('/' , function(req ,res){
    res.render("home");
})


app.get('/register' , function(req ,res){
    res.render("register");
})

app.post('/register' , function(req ,res){
    var user = new User({
        email: req.body.username,
        password: req.body.password
    })

    user.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
})


app.get('/login' , function(req ,res){
    res.render("login");
})

app.post('/login' , function(req , res){
    User.findOne({email : req.body.username} , function(err , value){
        if(err){
            console.log(err);
        }
        else{
            if (value){
                if(value.password === req.body.password){
                    res.render("secrets");
                }
            }
        }
    })
})
app.listen(process.env.PORT || 3000 , function(){
    console.log("Port is listening at 3000");
})


