const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const COLOR = {
  red: '\x1b[31m',
  default: '\x1b[0m'
};
const FILE_PATH = process.env.FILE_PATH;

const log = function () {
  console.log.apply(null, arguments);
};

const errorLog = function () {
  const args = [COLOR.red + '%s', ...arguments, COLOR.default];
  console.error.apply(null,  args);
};

if (!FILE_PATH) {
  errorLog("Provide 'FILE_PATH' variable.");
  return;
}

const checkIsRegularFile = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new Error("'" + filePath + "' file doesn't exist.");
  }
  if (!fs.lstatSync(filePath).isFile()) {
    throw new Error("'" + filePath + "' is not a file.");
  }
};

try {
  checkIsRegularFile(FILE_PATH);
} catch(e) {
  errorLog(e);
  return;
}

const filename = path.basename(FILE_PATH);

http.createServer(function (req, res) {
  fs.readFile(FILE_PATH, function (err, content) {
    if (err) {
      res.writeHead(400, {
        'Content-type': 'text/html'
      });
      errorLog(err);
      res.end('No such file');
    } else {
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.end(content);
    }
  });
}).listen(PORT);
