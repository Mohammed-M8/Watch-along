
const User = require('../models/user')
const FriendRequest = require('../models/friendrequests')
const Watchalong = require('../models/watchalong')

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
        if (userObject._id.toString() === sessionUser._id.toString()) return res.render('users/profile.ejs', { user: userObject })
        const user = await User.findById(sessionUser._id)
        let isFriend = user.friends.some(u => u.toString() === userObject._id.toString())
        let status = null;
        const Requested = await FriendRequest.findOne({
            requester: user._id,
            recipient: userObject._id,
            status: 'pending'
        })
        if (Requested) {
            status = Requested.status;
        }

        const watchalongs = await Watchalong.find({
            $and: [
                { $or: [{ host: sessionUser._id }, { participants: sessionUser._id }] },
                { $or: [{ host: userObject._id }, { participants: userObject._id }] }
            ]
        })
            .populate('host')
            .populate('participants');

        const friendCount = userObject.friends.length
        res.render('users/show.ejs', { userObject, isFriend, status, friendCount, watchalongs })
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
        if (req.params.id !== req.session.user._id.toString()) {
            return res.redirect("/");
        }
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
        if (req.params.id !== req.session.user._id.toString()) {
            return res.redirect("/");
        }
        const user = await User.findById(req.params.id)

        user.watchlist = user.watchlist.filter(
            show => show.showId.toString() !== req.params.showId
        )

        await user.save()

        res.redirect(`/users/${user._id}/watchlist`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const addToWatchlist = async (req, res) => {
    try {
        const id = req.params.id
        if (id !== req.session.user._id.toString()) {
            return res.redirect("/");
        }
        const user = await User.findById(id)
        if (user.watchlist.some(w => w.showId.toString() === req.params.showId)) return res.redirect(`/shows/${req.params.showId}`)
        const response = await fetch(
            `https://api.tvmaze.com/shows/${req.params.showId}`
        )

        const showData = await response.json()

        const show = {
            showId: showData.id,
            name: showData.name,
            image: showData.image ? showData.image.medium : null
        };

        user.watchlist.push(show)

        await user.save()

        res.redirect(`/users/${user._id}/watchlist`)
    } catch (error) {
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
