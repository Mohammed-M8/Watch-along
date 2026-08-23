const express = require('express')

const router = express.Router();
const showsCtrl = require('../controllers/showsCtrl')

router.get('/', showsCtrl.index)
router.get('/:id', showsCtrl.show)

module.exports = router;