const express = require('express');
const router = express.Router();
const requireRole = require('../utils/requireRole');
const itemController = require('../controllers/ItemController');

router.post('/', requireRole("USER"), itemController.create);

router.get('/aim/:id', requireRole("USER"), itemController.readByAimId);
router.get('/category/:id', requireRole("USER"), itemController.readByCategoryId);
router.get('/:id', requireRole("USER"), itemController.readById);

router.put('/', requireRole("USER"), itemController.update);

router.delete('/:id', requireRole("USER"), itemController.delete);


module.exports = router;