const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const privateKey = fs.readFileSync(path.join('src/auth/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join('src/auth/public.key'), 'utf8');

const expiresIn = '72h';
const algorithm = 'RS256';

module.exports = {
  sign: payload => jwt.sign(payload, privateKey, {
    expiresIn,
    algorithm,
  }),
  verify: token => {
    try {
      return jwt.verify(token, publicKey, {
        expiresIn,
        algorithm: [algorithm],
      });
    } catch (err) {
      return false;
    }
  },
  decode: token => jwt.decode(token, { complete: true }),
};