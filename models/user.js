const mongoose = require('mongoose');

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

  watchlist: {
    type: [Number]
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
// initial the model

const User = mongoose.model('User', userSchema);

// export it
module.exports = User;
