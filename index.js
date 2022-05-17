const express = require("express");
const app = express();
//const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const ejs = require("ejs");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const axios = require('axios');

app.use(express.static("public"));

var imageUrl ;
var reposUrl;
var repos=[];
var followers ;
var following ;
var username;
var name;
app.get("/home",function(req,res){
 res.render("home",{
   imageUrl:imageUrl,
   repos:repos,
   followers:followers,
   following:following,
   username:username,
   name:name
 });
})

app.get("/",function(req,res){
   res.render("auth",{});
});


app.get('/auth', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=7279fb0d29fb898ab907`);
});

app.get("/data",function(req,res){
  res.json(repos);
});

app.get("/image",function(req,res){
    res.json(imageUrl);
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id:'7279fb0d29fb898ab907',
    client_secret:'38df3cf30025334074cb588e7418d99bc3571c1c',
    code,
  };

  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      //res.redirect(`/?token=${token}`);
      res.redirect("/home");
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});



app.post("/",function(req,res){
 username = req.body.userID;
console.log(username);

request({
  url: "https://api.github.com/users/"+username,
  json: true,
  headers: {'user-agent': 'node.js'}
}, function(err, res, body){
 
  imageUrl = body.avatar_url;
  reposUrl=body.repos_url;
  followers = body.followers;
  following = body.following;
  name=body.name;
})

// requesting for repos url

request({
url: "https://api.github.com/users/"+username + "/repos",
json:true,
headers:{'user-agent':'node.js'}
},function(err,res,body){

repos=[];

 for(var i=0 ; i<body.length ; i++){
   repos.push(body[i]);
 }
// console.log(repos);
// console.log(repos[0].owner.avatar_url);

})

//res.redirect("/images");

})

app.listen(3001, function() {
  console.log("Server started on port 3001");
});

