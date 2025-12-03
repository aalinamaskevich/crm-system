const jwt = require("jsonwebtoken")

async function generateToken(account) {
    const data={
        id : account._id,
        username : account.username,
        role : account.role
    }

    const signature = 'MySuP3R_z3kr3t'
    const expiration = '24h';
    return jwt.sign({data, }, signature, {expiresIn: expiration});
  }

  exports.generateToken = generateToken;