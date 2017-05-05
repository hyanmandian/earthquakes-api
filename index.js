const express = require('express');
const app = express();
const cache = require('./services/cache');
const earthquakes = require('./services/earthquakes');

app.set('port', (process.env.PORT || 5000));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/earthquakes', async ({
  query: {
    from,
    to,
  },
}, res) => {
  const key = earthquakes.generateKey({
    from,
    to,
  });

  const hasCache = await cache.has(key);

  try {
    const data = hasCache ? await cache.get(key) : await earthquakes.get({
      from,
      to,
    });

    if (!hasCache) cache.set(key, JSON.stringify(data));

    return res.json(data);
  } catch (e) {
    return res.status(500).send({
      error: e,
    });
  }
});

app.use(function(req, res){
   res.send('Use the path /api/earthquakes in order to use the API.');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});