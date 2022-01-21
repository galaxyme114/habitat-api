const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const themes = require('../config/themes');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    image: {
      type: mongoose.ObjectId,
      ref: 'Media',
      default: null,
    },
    avatarColor: {
      type: Number,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    theme: {
      type: String,
      enum: themes,
      required: true,
      default: 'light',
    },
    bio: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      required: true,
      default: 'user',
    },
    followed_tags: [
      {
        type: String,
      },
    ],
    followed_users: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    habitats: {
      current: {
        type: mongoose.ObjectId,
        ref: 'Habitat',
      },
      owner: [
        {
          type: mongoose.ObjectId,
          ref: 'Habitat',
        },
      ],
      admin: [
        {
          type: mongoose.ObjectId,
          ref: 'Habitat',
        },
      ],
      user: [
        {
          type: mongoose.ObjectId,
          ref: 'Habitat',
        },
      ],
    },
    newNotificationsCounter: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema
  .virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (v) {
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  });

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
