require('dotenv').config({ path: '.env.local' });
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing actual image upload...');

cloudinary.uploader.upload(
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  { resource_type: 'auto' }
)
  .then((result) => {
    console.log('UPLOAD SUCCESS:', result.secure_url);
  })
  .catch((error) => {
    console.log('UPLOAD FAILED - Full error:');
    console.log(JSON.stringify(error, null, 2));
  });