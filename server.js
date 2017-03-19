var express = require('express');

var app1 = express();
var app2 = express();
var app3 = express();

// Visualization 1: Bubble Chart
app1.use(express.static(__dirname + '/visualisations' + '/bubble_chart'));
app1.use(express.static(__dirname + '/data'));
app1.use(express.static(__dirname + '/d3'));

// Visualization 2: Bar Chart
app2.use(express.static(__dirname + '/visualisations' + '/pie_chart'));
app2.use(express.static(__dirname + '/data'));
app2.use(express.static(__dirname + '/d3'));

// Visualization 3: Line Graph
app2.use(express.static(__dirname + '/visualisations' + '/heatmap'));
app2.use(express.static(__dirname + '/data'));
app2.use(express.static(__dirname + '/d3'));

var port1 = 4000;
var port2 = 4001;
var port3 = 4002;

app1.listen(port1);
app2.listen(port2);
app3.listen(port3);

console.log('Server running at http://localhost:' + port1 + '/');
console.log('Server running at http://localhost:' + port2 + '/');
console.log('Server running at http://localhost:' + port3 + '/');
