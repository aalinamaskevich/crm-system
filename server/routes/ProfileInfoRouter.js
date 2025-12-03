const express = require('express');
const router = express.Router();
const attachCurrentUser = require('../utils/attachCurrentUser');
const profileInfoController = require('../controllers/ProfileInfoController');

router.get('/', profileInfoController.readAll);
router.get('/:id', attachCurrentUser, profileInfoController.readById);
router.get('/account/:id', attachCurrentUser, profileInfoController.readByAccountId);
router.put('/', attachCurrentUser, profileInfoController.update);

module.exports = router;