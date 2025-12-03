const express = require('express');
const router = express.Router();
const requireRole = require('../utils/requireRole');
const categoryController = require('../controllers/CategoryController');

router.post('/', requireRole("USER"), categoryController.create);

router.get('/account/:id', requireRole("USER"), categoryController.readByAccountId);
router.get('/:id', requireRole("USER"), categoryController.readById);

router.put('/', requireRole("USER"), categoryController.update);

router.delete('/:id', requireRole("USER"), categoryController.delete);


module.exports = router;