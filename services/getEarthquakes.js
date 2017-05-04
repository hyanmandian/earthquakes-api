const { formatResult, getCacheKey } = require('../formatters');

const getEarthquakes = (req, res, client, api) => {
  let { from, to } = req.query;
  api.earthquakes.get(from, to)
    .then(response => {
      client.set(getCacheKey(from, to), response.data.count);
      res.json(formatResult(response.data.count));
    }).catch((error) => console.log(error));
};

module.exports = getEarthquakes;