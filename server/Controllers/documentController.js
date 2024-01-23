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

// module.exports.getSingleDocument = async (req, res, next) => {
//   const title = req.params.title;

//   try {
//     const document = await Document.findOne({ title });
//     res.status(200).json({ document });
//   } catch (error) {
//     console.error('Error fetching document by title:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
