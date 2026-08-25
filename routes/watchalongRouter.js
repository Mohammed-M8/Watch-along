const express = require('express')
const router = express.Router();
const watchalongCtrl = require('../controllers/watchalongCtrl')

router.get('/', watchalongCtrl.index)
router.get('/invites', watchalongCtrl.watchalongInvites)
router.get('/new/:showId', watchalongCtrl.new)
router.get('/:id', watchalongCtrl.show)
router.post('/', watchalongCtrl.create)
router.get('/:id/edit', watchalongCtrl.edit)
router.put('/:id', watchalongCtrl.update)
router.patch('/:id', watchalongCtrl.updateInvite)
router.delete('/:id', watchalongCtrl.delete)


module.exports = router