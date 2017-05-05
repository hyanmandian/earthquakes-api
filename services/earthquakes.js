const axios = require('axios');

module.exports = {
  get: async ({
    from,
    to
  }) => {
    const {
      data: {
        count: total
      }
    } = await axios.get(`http://earthquake.usgs.gov/fdsnws/event/1/count?format=geojson&starttime=${from}-01-01&endtime=${to}-12-31`);

    return {
      total,
    };
  },
  generateKey: ({
    from,
    to
  }) => `from-${from}-to-${to}`,
};