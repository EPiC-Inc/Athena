var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
     extended: true
}));

// GET method route
app.get('/', function (req, res) {
  res.sendFile('index.html');
})

// POST method route
app.post('/', function (req, res) {
  //console.log(req.body);
  res.send('POST request to the homepage');
})

http.listen(8080, function () {
  console.log(`Listening on port ${http.address().port}`);
});

app.all('/secret', function (req, res) {
  res.send('a');
})
