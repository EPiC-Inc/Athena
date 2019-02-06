var express = require("express");
var app = express();
var http = require("http").Server(app);
var url = require("url");
var fs = require("fs");
var bodyParser = require("body-parser");
const { Client } = require("pg"); // For the database

const port = process.env.PORT || 8080;

// To connect to database:
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
client.connect();
//console.log(process.env.DATABASE_URL);

app.use(express.static(__dirname + "/html"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
}));

// Functions
// Send a query to the database
async function querydb(command, req, res) {
  console.log("command="+command);
  client.query(command)
    .then((dbres) => {console.log(dbres.rows);
      res.send(dbres.rows)})
    .catch((err) => {console.log(err.stack), res.send(err.stack)})
}

function async_dbquery(req, res) {
  //console.log("Result of "+req.body.command+" : "+qdb(req.body.command));
  return new Promise(function(resolve, reject){
    // Do async
    //console.log("Promise finished:"+querydb(req.body.command));
    //dbres = result;
    resolve(querydb(req.body.command, req, res));
    //resolve(dbres);
  });
  //res.send(cmd);
}

function merge(values, content) {
  for (var key in values) {
    content = content.replace("{{"+key+"}}", values[key]);
  }
  return content;
}

function readFileSilent(filename) {
  if (filename) {
    return fs.readFileSync("./html/"+filename, 'utf8');
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
  var fileContent = fs.readFileSync("./html/"+htmlFile+".html", 'utf8')
}

// GET method route
app.get("/", function(req, res){
  //res.send(assembleLong('indexHead.html', 'indexBody.html', '', {}));
  res.sendFile('html/index.html');
});

app.get("/:file", function(req, res){
  res.send('blank');
});

// POST method routing
app.post("/", function(req, res){
  //console.log(req.body);
  //parse the data sent
  var userData = req.body;
  console.log(userData);
  res.send("POST request to the homepage");
});

app.post("/database-entry", function(req, res){
  res.send("wip");
});

app.post("/database-query", function(req, res){
  //console.log(querydb(req.body.command));
  async_dbquery(req, res)
  .then((result) => {
    //res.send(result);
    //console.log("Promise verified:"+result);
  })
  .catch((err) => {
    console.log("Stuff broke:"+err);
    //res.send("Error 500 : Stuff Broke<br>If you're the server owner, see the logs for more info");
  });
});

// ALL routing
app.all("/secret", function (req, res) {
  res.send("a");
});

// Server starting
http.listen(port, function () {
  console.log(`Listening on port ${http.address().port}`);
});

//console.log(querydb("select * from users"));
