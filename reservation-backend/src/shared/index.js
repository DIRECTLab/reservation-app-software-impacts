const errors = require('./error');
// Makes sure the server always sends a response
const asyncWrapper = callback => (req, res, next) => callback(req, res, next).catch(next)

// To ensure all data comes through with the same format
const makeResponse = (data = {}, error = null) => ({
  data,
  error,
});

module.exports = {
  asyncWrapper: asyncWrapper,
  makeResponse: makeResponse,
  errors,
};
