require('dotenv').config();
var cors = require('cors');

const path = require('path');
const express = require('express');
const models = require('./database');
const shared = require('./shared');

const app = express();
const port = 11236;
// const port = 3030;

// This sets up express to pre-parse the body of requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.database = models;
app.use((req, res, next) => {
  res.locals.models = models;
  return next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET')
    console.log(req.method, req.url);
  next();
});

app.use('/', require('./routes'));

app.use((error, req, res, next) => {
  let status;
  if (error instanceof shared.errors.UnauthorizedError)
    status = 403; // Forbidden (user known, no access)
  else if (error instanceof shared.errors.UnauthenticatedError)
    status = 401;  // Unauthorized (user not known)
  else if (error instanceof shared.errors.InvalidRequestError)
    status = 400; // Bad request
  else {
    console.error(req.method, req.url, error)
    status = 500;  // Server Error
    error.message = 'Something went wrong with the server.';
  }
  return res
    .status(status)
    .json(shared.makeResponse({}, error.message));
})


app.listen(port, () => {
  console.log(`Starting server on http://localhost:${port}`);
});


module.exports = app;
