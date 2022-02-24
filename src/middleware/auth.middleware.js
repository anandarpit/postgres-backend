const jwt = require(`jsonwebtoken`);
const createError = require(`http-errors`);
const fs = require("fs");
const path = require("path");
const pathToPubKey = path.join(__dirname, "..", "config/key/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");
const catchAsync = require("../utils/catchAsync");

module.exports = {
  isLoggedIn: catchAsync(async (req, res, next) => {
      const token = req.headers[`authorization`];
      if (!token) throw createError.BadRequest({ message: `Token not found` });
        
      jwt.verify(token, PUB_KEY, (err, payload) => {
        if (err) {
          if (err.name == "JsonWebTokenError")
            throw createError.BadRequest(); //TODO
          else throw createError.InternalServerError();
        } else {
          res.locals.authenticated = true;
          res.locals.payload = payload;
          next();
        }
      });
  })
}