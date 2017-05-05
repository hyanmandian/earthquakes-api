const cache = process.env.REDIS_URL 
  ? require('redis').createClient(process.env.REDIS_URL)
  : require("redis-mock").createClient();

const get = async (key) => {
    return new Promise((resolve) => {
        cache.get(key, (err, data) => {
            resolve(JSON.parse(data));
        });
    });
}

module.exports = {
    has: async (key) => {
        const data = await get(key);

        return !!data;
    },
    get,
    set: cache.set,
};