const omitFields = (obj, fields) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!fields.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

const batchPromises = async (items, batchSize, fn) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};

module.exports = {
  omitFields,
  batchPromises,
};
