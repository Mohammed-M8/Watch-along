const Watchalong = require('../models/watchalong')
const User = require('../models/user')
const index = async (req, res) => {
    try {
        const watchalongs = await Watchalong.find();
        res.render("watchalongs/index.ejs", { watchalongs })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const show = async (req, res) => {
    try {
        const watchalong = await Watchalong.findById(req.params.id);
        res.render("watchalongs/show.ejs", { watchalong })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const newWatchalong = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        const friends = user.friends;
        res.render("watchalongs/new.ejs", { friends })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const create = async (req, res) => {
    try {
        const formData = req.body;
        formData.host = req.session.user
        await Watchalong.create(formData)
        res.redirect("/watchalongs")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const edit = async (req, res) => {
    try {
        const watchalong = await Watchalong.findById(req.params.id)
        res.render("watchalongs/edit.ejs", { watchalong })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const update = async (req, res) => {
    try {
        const watchalong = await Watchalong.findById(req.params.id)
        watchalong.set(req.body)
        await watchalong.save();
        res.redirect("/watchalongs")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}
const updateInvite = async (req, res) => {
    try {
        const watchalong = await Watchalong.findById(req.params.id)
        const recipientUser = req.session.user;

        if (!watchalong.invitedUsers.some(
            id => id.toString() === recipientUser._id.toString()
        )) {
            return res.redirect("/watchalongs")
        }

        const action = req.body.action;
        if (action === "accept") {
            watchalong.invitedUsers.pull(recipientUser._id)
            watchalong.participants.push(recipientUser._id)
        }
        else if (action === "decline") {
            watchalong.invitedUsers.pull(recipientUser._id)
        }
        else {
            return res.redirect("/watchalongs")
        }
        await watchalong.save();
        res.redirect("/watchalongs")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const deleteWatchalong = async (req, res) => {
    try {
        const watchalong = await Watchalong.findById(req.params.id)

        if (!watchalong) return res.redirect("/watchalongs")
        if (watchalong.host.toString() !== req.session.user._id.toString()) return res.redirect("/watchalongs")
        await Watchalong.findByIdAndDelete(req.params.id)
        res.redirect("/watchalongs")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

module.exports = {
    index, show, new: newWatchalong, create, edit, update, updateInvite, delete: deleteWatchalong
}



