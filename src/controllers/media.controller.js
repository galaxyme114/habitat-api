const axios = require('axios');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { s3 } = require('../services/ImageUpload');
const { mediaService, moodboardService, userService } = require('../services');

const getImageSource = async (data) => {
  const response = await axios({
    method: 'get',
    url: data.photo,
    responseType: 'arraybuffer',
  });

  const imgBuffer = Buffer.from(new Uint8Array(response.data));
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: `${data.userId}/${Date.now()}`,
    Body: imgBuffer,
    ACL: 'public-read',
  };

  const imageData = await s3.upload(params).promise();
  return imageData.Location;
};

const uploadImage = catchAsync(async (req, res) => {
  const mediaUrl = await getImageSource(req.body);
  const media = await mediaService.createAsset({ url: mediaUrl, orientation: req.body.orientation, owner: req.body.userId });
  res.status(httpStatus.CREATED).send(media);
});

const addTagToImage = catchAsync(async (req, res) => {
  const { assetId, tags } = req.body;
  const updatedMedia = await mediaService.addTagToAsset(assetId, tags);
  res.status(httpStatus.CREATED).send(updatedMedia);
});

const dropzone = catchAsync(async (req, res) => {
  // add moodboard id to request body
  const media = await mediaService.createAsset({ url: req.file.location, owner: req.body.userId });
  await moodboardService.addImageToMoodBoard(req.body.moodboardId, media.id);
  res.send('Image successfully uploaded');
});

const newProjectImage = catchAsync(async (req, res) => {
  const media = await mediaService.createAsset({ url: req.file.location, owner: req.body.userId });
  res.send(media);
});

const userProfileImage = catchAsync(async (req, res) => {
  // add moodboard id to request body
  const media = await mediaService.createAsset({ url: req.file.location, owner: req.body.userId });
  // TODO add update user route
  await userService.updateUserById(req.body.userId, { image: media.id });
  res.send('Image successfully uploaded');
});

module.exports = {
  uploadImage,
  addTagToImage,
  dropzone,
  newProjectImage,
  userProfileImage,
};
