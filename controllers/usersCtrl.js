
const User = require('../models/user')
const FriendRequest = require('../models/friendrequests')

const index = async (req, res) => {
    try {
        const search = req.query.search


        const users = await User.find()

        res.render("users/index.ejs", { users, search })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}


const search = async (req, res) => {
    try {
        const search = req.query.search

        let users

        if (search) {
            users = await User.find({
                username: { $regex: search, $options: "i" },
            })
        } else {
            users = await User.find()
        }
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}


const show = async (req, res) => {
    try {
        const userObject = await User.findById(req.params.id)
        if (!userObject) return res.redirect('/');
        const sessionUser = req.session.user;
        if (userObject._id.toString() === sessionUser._id.toString()) return res.render('users/profile.ejs')
        const user = await User.findById(sessionUser._id)
        let isFriend = user.friends.some(u => u.toString() === userObject._id.toString())
        let status = null;
        const Requested = await FriendRequest.findOne({
            requester: user._id,
            recipient: userObject._id
        })
        if (Requested) {
            status = Requested.status;
        }
        res.render('users/show.ejs', { userObject, isFriend, status })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const edit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user._id.toString() !== req.session.user._id.toString()) return res.redirect("/")
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
        res.redirect("/users/watchlist")
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
        res.redirect("/users/watchlist")
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const friends = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('friends')
        if (!user) return res.redirect("/")
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
        const friend = await User.findById(req.params.friendId)
        if (!user || !friend) {
            return res.redirect("/users")
        }
        user.friends.pull(req.params.friendId)
        await user.save();
        friend.friends.pull(user._id)
        await friend.save()
        res.redirect(`/users/${user._id}/friends`)

    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}




module.exports = {
    index, search, show, edit, update, watchlist, removeFromWatchlist, addToWatchlist, friends, removeFriend
}
