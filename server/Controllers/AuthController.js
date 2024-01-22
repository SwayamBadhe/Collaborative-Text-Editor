const User = require('../models').User;
const Document = require('../models').Document;
const { createSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcryptjs');

module.exports.SignUp = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ userName, password });
    await Document.create({
      title: 'Default Document',
      ownerId: user._id,
      collaborators: [user._id],
      content: [],
    });
    const token = createSecretToken(user._id);
    res.cookie('token', token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: 'User created successfully', success: true, user });
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = createSecretToken(user._id);
    res.cookie('token', token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(200)
      .json({ message: 'User logged in successfully', success: true, user });
    next();
  } catch (error) {
    console.log(error);
  }
};
