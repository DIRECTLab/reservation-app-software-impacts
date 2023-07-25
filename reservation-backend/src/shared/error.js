class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Unauthorized Error: ' + message
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Unauthenticated Error: ' + message
  }
}


class InvalidRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Invalid Request Error: ' + message
  }
}

module.exports = {
  UnauthorizedError,
  InvalidRequestError,
  UnauthenticatedError,
}