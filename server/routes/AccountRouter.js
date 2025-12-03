const express = require('express');
const router = express.Router();
const accountController = require('../controllers/AccountController');
const attachCurrentUser = require('../utils/attachCurrentUser');
const requireRole = require('../utils/requireRole');

router.post('/init', accountController.init);
router.get('/init', accountController.getInit);
router.post('/login', accountController.login);
router.post('/signup', accountController.signup);
router.post('/check-key', accountController.checkKey);
router.put('/change-password', attachCurrentUser, accountController.changePassword);
router.put('/:id', requireRole("ADMIN"), accountController.changeActive);

module.exports = router;