var express = require('express');
var app = express();

app.use(express.static(__dirname + '/visualisations' + '/bubble_chart'));
app.use(express.static(__dirname + '/data'));
app.use(express.static(__dirname + '/d3'));

var port = 4000;
app.listen(port);

console.log('Server running at http://localhost:' + port + '/');
