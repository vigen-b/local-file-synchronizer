const http = require('http');
const fs = require('fs');
const path = require('path');
const auth = require('basic-auth');
var compare = require('tsscmp');

const log = require('./utils/log');
const config = require('./config');

const isAuthorized = credentials => {
  if (!credentials) {
    return false;
  }
  const name = credentials.name;
  const pass = credentials.pass;
  var valid = true;

  valid = compare(name, config.username) && valid;
  valid = compare(pass, config.secret) && valid;

  return valid;
}

const handleError = (message, headers, statusCode = 400) => {
  return res => {
    res.writeHead(statusCode, headers);
    res.end(message);
  };
};

const handleRequest = (filePath, filename) => {
  return res => {
    fs.readFile(filePath,  (err, content) => {
      if (err) {
        log.error(err);
        handleError('No such file', {
          'Content-type': 'text/html'
        })(res);
      } else {
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.end(content);
      }
    });
  }
};

const handler = filePath => {
  const filename = path.basename(filePath);
  return (req, res) => {
    const credentials = auth(req);
    if (!isAuthorized(credentials)) {
      handleError('Access denied', {
        'WWW-Authenticate': 'Basic realm="example"'
      }, 401)(res);
    } else {
      handleRequest(filePath, filename)(res);
    }
  };
};

const startServer = config => {
  const filePath = config.filePath;
  const server = http.createServer(handler(filePath));
  const port = config.port;

  server.listen(port);
  log.info('Serve running on port %d', port);
};

module.exports = startServer;
