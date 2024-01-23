const { Document } = require('../models');

module.exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find();
    res.json({ documents });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
