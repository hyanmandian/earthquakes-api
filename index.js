const { formatResult, getCacheKey } = require('./formatters');
const express = require('express');
const axios = require('axios');
const app = express();
const client = require('redis').createClient(process.env.REDIS_URL);
const api = {
  earthquakes: {
    get: (from, to) => axios.get(`http://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${from}-01-01&endtime=${to}-12-31`)
  }
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.get('/', () => console.log('Use the path /api/earthquakes in order to use the API.'));

getEarthquakes = (req, res, next) => {
  let { from, to } = req.query;
  api.earthquakes.get(from, to)
    .then(response => {
      client.set(getCacheKey(from, to), response.data.count);
      res.json(formatResult(response.data.count));
    }).catch((error) => console.log(error));
};

cache = (req, res, next) => {
  const { from, to } = req.query;

  client.get(getCacheKey(from, to), (err, data) => {
    if (err) throw err;

    if (data) {
      res.json(formatResult(data));
    } else {
      next();
    }
  });
}

app.get('/api/earthquakes', cache, getEarthquakes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


