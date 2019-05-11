/**
 * @param arr an array in the form [{k: v1},{k, v2}] */
const mapToArray = (arr, field) => {
  return arr.map(x => x[field]);
};

module.exports = {
  mapToArray
};