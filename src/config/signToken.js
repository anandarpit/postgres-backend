const jwt = require(`jsonwebtoken`);
const createError = require(`http-errors`);
const fs = require("fs");
const path = require("path");

const pathToPrivKey = path.join(__dirname, "./key/id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf8"); //TODO Never use *Sync functions like the one here

function signJWTToken(userId) {
  return new Promise((resolve, reject) => {
    const _id = userId;
    const issuer = `reunion`;
    
    const payload = {
      sub: _id,
      iat: Date.now(),
      iss: issuer,
      type: `at`,
    };

    const options = {
      expiresIn: `7d`,
      algorithm: `RS256`,
    };

    jwt.sign(payload, PRIV_KEY, options, (err, token) => {
      if (err) {
        console.error(err.message);
        return reject(
          createError(500, { code: "ISE", message: "internal server error" })
        );
      }
      return resolve(token);
    });
  });
}

module.exports = { signJWTToken };
