const fs = require('fs');

const checkIsRegularFile = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new Error("'" + filePath + "' file doesn't exist.");
  }
  if (!fs.lstatSync(filePath).isFile()) {
    throw new Error("'" + filePath + "' is not a file.");
  }
};

module.exports = {
  checkIsRegularFile
};
