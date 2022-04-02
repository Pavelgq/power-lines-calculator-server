/**
 * Group object by period
 * TODO: period format!
 * Добавить limit
 * @param {Object} data
 * @param {string} field
 * @param {number} period
 * @returns
 */
const groupByPeriod = (data, field, period = 24 * 60 * 60 * 1000) => {
  const result = [];
  let current = 0;
  data.forEach((element) => {
    if (!result[current]) {
      result[current] = element;
      result[current].group = [];
      return;
    }
    if (result[current][field] - period < element[field]) {
      result[current].group.push(element);
    } else {
      current += 1;
      result[current] = element;
      result[current].group = [];
      return;
    }
  });

  return result;
};

module.exports = {
  groupByPeriod,
};
