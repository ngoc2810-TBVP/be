const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary configuration (can be stored in .env)
cloudinary.config({
  cloud_name: 'dw0niuzdf',
  api_key: '862679367621591',
  api_secret: 'wO63g36BhGNYjbvrhtfbfbwxXz8'
});

module.exports.upload = (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        // Use folder name passed in the request body (or set a default folder if none provided)
        const folderName = req.body.folder
        console.log(req.body)
        console.log(folderName)
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: folderName // Dynamically set the folder based on the request
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // Pipe the file stream into Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.secure_url; // Save Cloudinary URL in req.body
        console.log('Upload result:', result);
        next();
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).send(`Error uploading file: ${error.message}`);
      }
    }

    upload(req);
  } else {
    next();
  }
};
