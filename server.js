var express = require('express');
var app = express();

app.use(express.static(__dirname + '/pie_chart'));
app.use(express.static(__dirname + '/data'));
app.use(express.static(__dirname));

var port = 4000;
app.listen(port);

console.log('Server running at http://localhost:' + port + '/');
