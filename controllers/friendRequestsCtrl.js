const FriendRequest = require('../models/friendrequests')
const User = require('../models/user')
const index = async (req, res) => {
    try {
        const id = req.session.user._id
        const sent = await FriendRequest.find({ requester: id })
        const received = await FriendRequest.find({ recipient: id })
        res.render("requests/index.ejs", { sent, received })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const newRequest = (req, res) => {
    res.render("requests/new.ejs")
}

const create = async (req, res) => {
    try {
        const formData = req.body
        formData.requester = req.session.user
        await FriendRequest.create(formData);
        res.redirect("/requests")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

const modifyRequest = async (req, res) => {
    try {
        const id = req.params.id
        const formData = req.body;

        const friendRequest = await FriendRequest.findById(id);
        if (friendRequest.recipient.toString() !== req.session.user._id.toString()) {
            return res.redirect("/requests")
        }
        if (!friendRequest) return res.redirect("/requests")
        if (formData.action === "accept") {
            friendRequest.status = "accepted"
            const requester = await User.findById(friendRequest.requester)
            const recipient = await User.findById(friendRequest.recipient)
            requester.friends.push(friendRequest.recipient);
            await requester.save();
            recipient.friends.push(friendRequest.requester);
            await recipient.save();
        }
        else if (formData.action === "decline") {
            friendRequest.status = "declined"
        }
        else {
            return res.redirect("/requests")
        }

        await friendRequest.save();
        res.redirect("/requests")
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
}


const deleteRequest = async (req, res) => {
    try {
        const id = req.params.id
        const request = await FriendRequest.findById(id);
        if (request.requester.toString() !== req.session.user._id.toString()) {
            return res.redirect("/requests")
        }
        await FriendRequest.findByIdAndDelete(id)
        res.redirect("/requests")

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}



module.exports = { index, new: newRequest, create, modifyRequest, deleteRequest }