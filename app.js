//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser =require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption')
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true});
// modifying
const userSchema =new mongoose.Schema({
  email:String,
  password:String
});
// key
const secret =process.env.SECRET;
// plugin to impore fuctionality of schema
userSchema.plugin(encrypt,{secret:secret,ecryptedFields:['password'], excludeFromEncryption: ['email']});
const User =new mongoose.model('User',userSchema);
app.get('/', (req, res) => {
  res.render("home");
});
app.get('/login', (req, res) => {
  res.render("login");
});
app.get('/register', (req, res) => {
  res.render("register");
});
// only render secrects page after registerig
app.post("/register", (req,res) =>{
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save((err) =>{
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    }
  });
});
app.post("/login", (req,res) =>{
  const username = req.body.username;
  const password =req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err)
    {
      console.log(err);
    }else
    {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
