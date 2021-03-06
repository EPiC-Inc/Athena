var express = require("express");
var app = express();
var http = require("http").Server(app);
var url = require("url");
var fs = require("fs");
var bodyParser = require("body-parser");
var crypto = require('crypto');

const secret = "TailboneCancer";

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/html"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
}));

// Functions
function merge(values, content) {
  for (var key in values) {
    content = content.replace("{{"+key+"}}", values[key]);
  }
  return content;
}

function readFileSilent(filename) {
  if (filename) {
    return fs.readFileSync(__dirname+"/html/"+filename, 'utf8');
  } else {
    return '';
  }
}

// Assemble webpage
function assembleLong(htmlHeadFile, htmlBodyFile, htmlScriptsFile, values){
  var result = `<!DOCTYPE html>
<html>
  <head>
  `+readFileSilent("head.html")+readFileSilent(htmlHeadFile)+`
  </head>
  <body>
  `+merge(values, readFileSilent(htmlBodyFile))+`
  </body>
  `+readFileSilent(htmlScriptsFile)+`
</html>`
  return result;
}

function assemble(htmlFile, values) {
  var fileContent = fs.readFileSync(__dirname+"/html/"+htmlFile+".html", 'utf8')
}

// GET method route
app.get("/", function(req, res){
  //res.send(assembleLong('indexHead.html', 'indexBody.html', '', {}));
  res.sendFile(__dirname+'/html/index.html');
});

/*app.get("/:file", function(req, res){
  res.status(401);
  res.send('401 Unauthorized');
});*/

// POST method routing
app.post("/", function(req, res){
  //console.log(req.body);
  //parse the data sent
  var userData = req.body;
  if ((userData.user && userData.pass) || userData.session_cookie) {
    userData.pass = crypto.createHmac('sha256', secret).update(userData.pass).digest('hex');
    res.send('test')
    // Check userData against db
  } else {
    res.sendFile(__dirname+'/html/index.html');
  }
});

app.post("/database-entry", function(req, res){
  res.send("wip");
});

// ALL routing
app.all("/secret", function (req, res) {
  res.send("a");
});

app.use(function(req, res) {
  res.status(404);
  res.sendFile(__dirname+'/html/404.html', 404);
});

// Server starting
http.listen(port, function () {
  console.log(`Listening on port ${http.address().port}`);
});
