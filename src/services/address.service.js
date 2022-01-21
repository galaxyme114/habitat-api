const { Address } = require('../models');

/**
 * Create a habitats
 * @param {Object} addressBody
 * @returns {Promise<Habitat>}
 */
const createAddress = async (addressBody) => {
  const address = await Address.create(addressBody);
  return address;
};

module.exports = {
  createAddress,
};
