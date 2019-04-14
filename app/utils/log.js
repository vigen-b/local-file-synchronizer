const COLOR = {
  red: '\x1b[31m',
  default: '\x1b[0m'
};

const info = function () {
  console.log.apply(null, arguments);
};

const error = function () {
  const args = [COLOR.red + '%s', ...arguments, COLOR.default];
  console.error.apply(null,  args);
};

module.exports = {
  info,
  error
};
