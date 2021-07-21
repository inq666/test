const { Schema, model } = require('mongoose');

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imagePath: {
    type: String,
    /*  required: true, */
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('Post', schema);
