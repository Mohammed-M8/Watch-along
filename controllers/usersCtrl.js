
const User = require('../models/user')

const index = async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const show = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.send(user)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const edit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render("users/edit.ejs", { user })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
const update = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.set(req.body)
        await user.save()
        res.redirect("/users")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const watchlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const watchlist = user.watchlist;
        res.render("users/watchlist.ejs", { watchlist })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
const removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.watchlist.pull(req.params.showId)
        await user.save()
        res.redirect("users/watchlist")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
const addToWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.watchlist.push(req.params.showId)
        await user.save()
        res.redirect("users/watchlist")
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const friends = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const friends = user.friends;
        res.render('users/friends.ejs', { friends })
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
const removeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.friends.pull(req.params.friendId)
        await user.save();
        res.redirect(`users/${user._id}/friends`)

    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}




module.exports = {
    index, show, edit, update, watchlist, removeFromWatchlist, addToWatchlist, friends, removeFriend
}
