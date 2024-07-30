// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const { User } = require('../../models/users.model');
const cloudinary = require('cloudinary').v2;

const upload = async (req, res) => {
  const { id, imageUrl } = req.body;

  // cloudinary.uploader
  //   .upload(imageUrl, {
  //     public_id: id,
  //     overwrite: true,
  //   })
  //   .then((result) => {
  //     res.status(200).json(result.url);
  //   })
  //   .catch((error) => {
  //     res.status(error.status).json({ message: error.message });
  //   });
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: id,
      overwrite: true,
    });
    console.log('Cloudinary upload result:', result);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(error.http_code || 500).json({ message: error.message });
  }
};

module.exports = upload;
