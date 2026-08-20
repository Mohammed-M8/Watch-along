const express = require('express')
const router = express.Router();
const usersCtrl = require('../controllers/usersCtrl')
router.get("/", usersCtrl.index);
router.get('/:id', usersCtrl.show)
router.get('/:id/edit', usersCtrl.edit)
router.put('/:id', usersCtrl.update)
router.get('/:id/watchlist', usersCtrl.watchlist)
router.post('/:id/watchlist/:showId', usersCtrl.addToWatchlist)
router.delete('/:id/watchlist/:showId', usersCtrl.removeFromWatchlist)
module.exports = router;