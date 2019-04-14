const startServer = require('./server');
const log = require('./utils/log');
const fileUtils = require('./utils/file-utils');
const config = require('./config');

const start = (filePath, port) => {
  const server = startServer({
    port,
    filePath
  });
};

const init = filePath => {
  fileUtils.checkIsRegularFile(filePath);
};

const tryToRun = () => {
  const filePath = config.shareable_file;
  init(filePath);

  const port = config.port;
  start(filePath, port);
};

const run = () => {
  try {
    tryToRun();
  } catch (e) {
    log.error(e);
  }
};

const createApp = () => {
  return {
    run
  };
};

module.exports = createApp;
