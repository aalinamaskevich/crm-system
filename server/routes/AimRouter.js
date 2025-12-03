const express = require('express');
const router = express.Router();
const requireRole = require('../utils/requireRole');
const aimController = require('../controllers/AimController');

router.post('/', requireRole("USER"), aimController.create);

router.get('/category/:id', requireRole("USER"), aimController.readByCategoryId);
router.get('/:id', requireRole("USER"), aimController.readById);

router.put('/', requireRole("USER"), aimController.update);

router.delete('/:id', requireRole("USER"), aimController.delete);


module.exports = router;