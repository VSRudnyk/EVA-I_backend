// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
// const { User } = require('../../models/users.model');

const upload = async (req, res) => {
  const { id, imageUrl } = req.body;

  cloudinary.uploader
    .upload(imageUrl, {
      public_id: id,
      overwrite: true,
    })
    .then((result) => {
      res.status(200).json(result.url);
    })
    .catch((error) => {
      res.status(error.status).json({ message: error.message });
    });
};

module.exports = upload;
