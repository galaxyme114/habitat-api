const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// const elementSchema = mongoose.Schema({
//   type: {
//     type: String,
//   },
//   layer: [String],
//   segments: [Array],
//   config: {},
// });

const snapShotSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    image: {
      type: mongoose.ObjectId,
      ref: 'Media',
    },
    state: Object,
  },
  {
    timestamps: true,
  }
);

const roomPlanSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.ObjectId,
      ref: 'Project',
      required: true,
    },

    // NOTE Maybe later
    // habitat: {
    //   type: mongoose.ObjectId,
    //   ref: 'Habitat',
    //   required: true,
    // },

    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    owner: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    admins: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    users: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],

    snapShots: [snapShotSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      versionKey: false,
    },
  }
);

// add plugin that converts mongoose to json
roomPlanSchema.plugin(toJSON);
roomPlanSchema.plugin(paginate);

/**
 * @typedef Habitat
 */
const RoomPlan = mongoose.model('RoomPlan', roomPlanSchema);

module.exports = RoomPlan;
