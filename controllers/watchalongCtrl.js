const Watchalong = require('../models/watchalong')
const User = require('../models/user')
const index = async (req, res) => {
    try {
        const id = req.session.user._id
        const hosted = await Watchalong.find({ host: id })
            .populate('participants')
            .populate('invitedUsers');

        const added = await Watchalong.find({ participants: id })
            .populate('host')
            .populate('participants');
        res.render("watchalongs/index.ejs", { hosted, added })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const watchalongInvites = async (req, res) => {
    try {
        const watchalongs = await Watchalong.find({ invitedUsers: req.session.user._id })
        res.render("watchalongs/invites.ejs", { watchalongs })
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
        const user = await User.findById(req.session.user._id).populate('friends')
        const showId = req.params.showId;
        const show = await fetch(`https://api.tvmaze.com/shows/${showId}`).then(res => res.json())
        const friends = user.friends;
        const seasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`).then(res => res.json());


        res.render("watchalongs/new.ejs", {
            friends,
            showId,
            show,
            seasons
        });
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const create = async (req, res) => {
    try {
        const formData = req.body;
        const scheduledAt = new Date(formData.scheduledAt);

        if (scheduledAt < new Date()) {
            return res.redirect(`/watchalongs/new/${formData.showId}`);
        }

        if (!formData.invitedUsers || formData.invitedUsers.length === 0) {
            return res.redirect(`/watchalongs/new/${formData.showId}`);
        }

        const showData = await fetch(`https://api.tvmaze.com/shows/${formData.showId}`)
            .then(res => res.json());

        formData.showName = showData.name;
        formData.showImage = showData.image ? showData.image.medium : null;
        formData.participants = [];
        formData.host = req.session.user._id;

        await Watchalong.create(formData);
        res.redirect("/watchalongs");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

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
    index, show, new: newWatchalong, create, edit, update, updateInvite, delete: deleteWatchalong, watchalongInvites
}



