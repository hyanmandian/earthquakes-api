const express = require('express');
const axios = require('axios');
const app = express();
const client = require('redis').createClient(process.env.REDIS_URL);

const getEarthquakes = require('./services/getEarthquakes');
const checkCache = require('./services/checkCache');

const api = {
  earthquakes: {
    get: (from, to) => axios.get(`http://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${from}-01-01&endtime=${to}-12-31`)
  }
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/', () => console.log('Use the path /api/earthquakes in order to use the API.'));

app.get('/api/earthquakes', (req, res, next) => checkCache(req, res, next, client), (req, res) => getEarthquakes(req, res, client, api));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


