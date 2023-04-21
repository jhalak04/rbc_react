const express = require('express');
const expressWinston = require('express-winston');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');

const createApp = (logger) => {
  const app = express();

  app.use(expressWinston.logger({ winstonInstance: logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // TODO: Serve your React App using the express server
  const buildPath = path.normalize(path.join(__dirname, './client/build'));
  app.use(express.static(buildPath));

  app.use('/auth', authRouter);

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  // error handler
  app.use((err, req, res) => {
    res.status(err.status || 500);
  });

  return app;
};

module.exports = createApp;
