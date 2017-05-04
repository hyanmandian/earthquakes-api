let express = require('express');
let axios = require('axios');
let app = express();
const api = {
  earthquakes: {
    get: (from, to) => axios.get(`http://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${from}-01-01&endtime=${to}-12-31`)
  }
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

getEarthquakes = (req, res, next) => {
    let { from, to } = req.query;
    api.earthquakes.get(from, to)
      .then(response => res.json({ total: response.data.count}))
      .catch(function (error) {
        console.log(error);
      });
};

app.get('/api/earthquakes', getEarthquakes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


