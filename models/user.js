const mongoose = require('mongoose');

const watchlistSchema=new mongoose.Schema({
 showId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String
})
// create the schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  watchlist: [watchlistSchema],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
// initial the model

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;
