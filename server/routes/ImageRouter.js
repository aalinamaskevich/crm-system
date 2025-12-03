const express = require('express');
const router = express.Router();
const requireRole = require('../utils/requireRole');
const imageController = require('../controllers/ImageController');

router.post('/', requireRole("USER"), imageController.create);
router.get('/:name', imageController.readByName);

module.exports = router;