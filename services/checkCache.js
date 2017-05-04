const { formatResult, getCacheKey } = require('../formatters');

const checkCache = (req, res, next, client) => {
  const { from, to } = req.query;

  client.get(getCacheKey(from, to), (err, data) => {
    if (err) throw err;

    if (data) {
      res.json(formatResult(data));
    } else {
      next();
    }
  });
};

module.exports = checkCache;