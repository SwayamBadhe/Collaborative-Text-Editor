require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated' });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'You are not authenticated', status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return res.status(200).json({
          message: 'You are authenticated',
          status: true,
          user: user.userName,
        });
      } else {
        return res.json({ status: false });
      }
    }
  });
};
