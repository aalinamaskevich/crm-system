const Account = require("../models/Account")
const jwt = require("jsonwebtoken");

const attachCurrentUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(403).json({ error: 'Forbidden', message: "Необходим jwt-токен" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedTokenData = jwt.verify(token, 'MySuP3R_z3kr3t');

    if (!decodedTokenData) {
      return res.status(403).json({ error: 'Forbidden', message: "Неверный jwt-токен" });
    }

    const account = await Account.findOne({ _id: decodedTokenData.data.id });

    if (!account) {
      return res.status(403).json({ error: 'Forbidden', message: "Неверный jwt-токен" });
    }

    // Присвоение текущего аккаунта в запрос
    req.currentAccount = account;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden', message: "Неверный jwt-токен" });
  }
}
module.exports = attachCurrentUser;