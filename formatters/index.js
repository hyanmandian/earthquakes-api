const formatResult = result => ({ 'total': result });
const getCacheKey = (start, end) => `from-${start}-to-${end}`;

module.exports = {
  formatResult,
  getCacheKey
}