# GitViz
Visualizing data with D3

# Usage
cd to the directory and run the following command: <br>

`node server.js`<br>

Open up your browser and use the provided url (http://localhost:4000/) to access the visualisation.

# Changing the visualisation
To change visualisations we have to redirect express to the new index.html file.<br>
1. First, open the server.js file.<br>
1. You should be able to find a line that looks something like this:<br>
`app.use(express.static(__dirname + '/visualisations' + '/pie_chart'));`<br>
1. Change the pie_chart section to the directory containing the visualisation you want to use.<br>

# Adding new visualisations
Express will only look for the index.html file in the directory specified by the `server.js` file. To make sure that we run the correct `index.html` file, we will seperate them using additional directories.
1. In the visualisations directory, make a new directory for the new visualisation. <br>
1. In this new directory, create a file named `index.html` with the code of your visualisation. <br>

# Errors
For any errors, first try this: <br>
1. Delete the `node_modules` folder. <br>
1. Run the command `npm install`. <br>

This will download a new node_modules folder which should solve most problems. <br>
