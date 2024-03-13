const constants = require('../constants/constants');
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const config = require('config');
const cryptoSecret = config.get("cryptoToken");
module.exports = {
  async genPasswordHash(password, saltRounds = constants.Numbers.ten) {
    return await bcrypt.hash(password, saltRounds);
  },


  decryptCryptoToken(token) {
    const bytes = crypto.AES.decrypt(token, cryptoSecret);
    return JSON.parse(bytes.toString(crypto.enc.Utf8));
  },

};
