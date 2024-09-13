const cloudinary = require('cloudinary').v2;

const uploadAvatar = async (id, imageUrl) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: id,
      overwrite: true,
    });
    return result.secure_url;
  } catch (error) {
    return error.message;
  }
};

module.exports = uploadAvatar;
