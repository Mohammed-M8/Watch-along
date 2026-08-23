const express = require('express')
const router = express.Router({ mergeParams: true });

const requestsCtrl = require("../controllers/friendRequestsCtrl")


router.get('/', requestsCtrl.index)
router.get('/new', requestsCtrl.new)
router.post('/', requestsCtrl.create)
router.patch('/:id', requestsCtrl.modifyRequest)
router.delete('/:id', requestsCtrl.deleteRequest)


module.exports = router