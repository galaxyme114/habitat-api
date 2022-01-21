const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const addressSchema = mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    route: {
      type: String,
    },
    street_number: {
      type: String,
    },
    state: {
      type: String,
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
addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

addressSchema.virtual('fullAddress').get(function () {
  let fullAddress = '';
  if (this.street_number) {
    fullAddress += this.street_number;
  }
  if (this.route) {
    fullAddress += ` ${this.route},`;
  }
  if (this.locality) {
    fullAddress += ` ${this.locality}`;
  }
  if (this.state) {
    fullAddress += ` ${this.state}`;
  }
  if (this.postal_code) {
    fullAddress += ` ${this.postal_code}`;
  }
  return fullAddress;
});

/**
 * @typedef Address
 */
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
