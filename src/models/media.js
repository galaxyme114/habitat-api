const mongoose = require('mongoose');
const MMD = require('mongoose-media-plugin');
const { Configuration } = require('mongoose-media-plugin');
const fs = require('fs');
const logger = require('../config/logger');

const mediaSchema = mongoose.Schema({
  name: { type: String },
});

const Setup = new Configuration({
  bucket: '',
  createBucket: true, // Set this to create the bucket if it  doesnt exist.
});

(async () => {
  const config = await Setup.Configure();
  const local = fs.createReadStream('<path to local file>');

  mediaSchema.plugin(MMD, config);
  const Media = mongoose.model('Media', mediaSchema);

  const Insert = new Media({
    name: 'first document',
    body: local,
  });

  Insert.save((err, saved) => {
    logger.log(err, saved);
    /**
     * Returns....
     * {
     *     _id: <ObjectId>
     *     name: "first document",
     *     ContentType: "video/mp4", //etc
     *     ETag: <S3 Etag>, //useful for setting cache see express example.
     *     Size: <size in bytes for file>,
     *     body: <ReadableStream> // from S3
     *     created: Date,
     *     updated: Date,
     *     uploaded: Date
     * }
     */

    // download the file...
    const download = fs.createWriteStream('<path to new file>');
    saved.body.pipe(download);
  });
})();
