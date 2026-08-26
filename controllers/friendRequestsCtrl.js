const FriendRequest = require('../models/friendrequests')
const User = require('../models/user')
const sendFriendRequestEmail = require('../services/sendFriendRequestEmail')


const index = async (req, res) => {
    try {
        const id = req.session.user._id
        const sent = await FriendRequest.find({ requester: id, status: 'pending' }).populate('recipient')
        const received = await FriendRequest.find({ recipient: id, status: 'pending' }).populate('requester')
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
        const currentUser = await User.findById(req.session.user._id);


        if (formData.recipient.toString() === req.session.user._id.toString()) return res.redirect("/")

        if (currentUser.friends.includes(formData.recipient)) {
            return res.redirect(`/users/${formData.recipient}`);
        }

        const exists = await FriendRequest.findOne({ recipient: formData.recipient, requester: req.session.user._id, status: 'pending' })
        if (exists) return res.redirect(`/users/${formData.recipient}`)

        formData.requester = req.session.user._id
        formData.status = 'pending'
        await FriendRequest.create(formData);
        const recipientUser = await User.findById(formData.recipient);

        sendFriendRequestEmail(recipientUser, currentUser)
            .catch(err => console.log('Friend request email failed:', err));
             res.redirect(`/users/${formData.recipient}`)
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
        if (!friendRequest) return res.redirect("/requests")

        if (friendRequest.status !== 'pending') {
            return res.redirect("/requests");
        }
        if (friendRequest.recipient.toString() !== req.session.user._id.toString()) {
            return res.redirect("/requests")
        }
        if (formData.action === "accept") {
            friendRequest.status = "accepted"
            const requester = await User.findById(friendRequest.requester)
            const recipient = await User.findById(friendRequest.recipient)

            if (!requester || !recipient) {
                return res.redirect("/requests")
            }
            if (!requester.friends.includes(friendRequest.recipient)) {
                requester.friends.push(friendRequest.recipient);
            }

            if (!recipient.friends.includes(friendRequest.requester)) {
                recipient.friends.push(friendRequest.requester);
            }

            await requester.save();
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
        if (!request) return res.redirect("/requests")
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