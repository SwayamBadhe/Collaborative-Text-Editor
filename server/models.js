const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const DocumentSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  title: String,
  content: Object,
});

UserSchema.pre('save', async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
const Document = mongoose.model('Document', DocumentSchema);

module.exports = {
  User,
  Document,
  UserSchema,
  DocumentSchema,
};
