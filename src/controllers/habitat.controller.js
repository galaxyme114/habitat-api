const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { habitatService, userService, addressService, tokenService, emailService, moodboardService } = require('../services');

const createHabitatForUser = catchAsync(async (req, res) => {
  // Create habitat
  const habitat = await habitatService.createHabitat({
    name: req.body.name,
    description: req.body.description,
    owners: [req.user.id],
  });

  // Add habitatId to user model
  await userService.createUserOwnerHabitat(req.user.id, habitat.id);

  // Create address and link to habitat
  if (req.body.address) {
    const address = await addressService.createAddress(req.body.address);
    await habitatService.updateHabitatById(habitat.id, {
      address: address.id,
    });
  }

  // Create inspiration moodboard
  const moodboard = await moodboardService.createMoodBoard({
    habitat: habitat.id,
  });

  // Link address and moodboard to habitat
  const updatedHabitat = await habitatService.updateHabitatById(habitat.id, {
    moodboard: moodboard.id,
  });

  res.status(httpStatus.CREATED).send(updatedHabitat);
});

const getHabitatsForUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await habitatService.queryHabitats(userId);
  logger.info(result);
  res.send(result);
});

const getHabitat = catchAsync(async (req, res) => {
  const habitat = await habitatService.getHabitatById(req.params.habitatId);
  if (!habitat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Habitat not found');
  }
  await userService.updateCurrentHabitat(req.user.id, habitat);
  logger.info(habitat);
  res.send(habitat);
});

const getArchivedHabitats = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await habitatService.queryHabitats(userId, true);
  logger.info(result);
  res.send(result);
});

const updateHabitat = catchAsync(async (req, res) => {
  // Create address and link to habitat
  if (req.body.address) {
    const address = await addressService.createAddress(req.body.address);
    await habitatService.updateHabitatById(req.params.habitatId, {
      address: address.id,
    });

    delete req.body.address;
  }

  const habitat = await habitatService.updateHabitatById(req.params.habitatId, { ...req.body });
  res.send(habitat);
});

const deleteHabitat = catchAsync(async (req, res) => {
  await habitatService.deleteHabitatById(req.params.habitatId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToHabitat = catchAsync(async (req, res) => {
  // TODO Will need to rework this after we get confirmed taxonomy
  const { email, name } = req.body;
  const { habitatId } = req.params;
  const user = await userService.getUserByEmail(email);
  const token = await tokenService.generateHabitatInviteToken(email, habitatId);
  if (!user) {
    await emailService.sendNewUserInviteEmail(email, name, token);
  } else {
    await emailService.sendExistingUserInviteEmail(email, user.firstName, name, token);
  }
  const habitat = await habitatService.addPendingInvite(habitatId, email);
  res.send(habitat);
});

const removeUserFromHabitat = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const { habitatId } = req.params;
  const habitat = await habitatService.removeUserFromHabitat(habitatId, userId);
  res.send(habitat);
});

const acceptHabitatInvite = catchAsync(async (req, res) => {
  const { userId, token } = req.body;
  const currentUser = await userService.getUserById(userId);
  // TODO should I move the verification into token.services?
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (payload.email !== currentUser.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect invitee email');
    }
    await habitatService.addUserToHabitat(payload.habitatId, userId);
    await userService.addHabitatToUser(userId, payload.habitatId);
    await habitatService.removePendingInvite(payload.habitatId, currentUser.email);
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }

  res.status(httpStatus.OK).send('User added to habitat');
});

const getInspiration = catchAsync(async (req, res) => {
  const { habitatId } = req.params;
  const habitat = await habitatService.getHabitatInspirationById(habitatId);
  const items = [];
  habitat.moodboard.images.forEach((image) => {
    items.push({ type: 'image', data: image, moodboard: habitat.moodboard.id });
  });

  habitat.projects.forEach((project) => {
    project.articles.forEach((article) => {
      items.push({ type: 'article', data: article });
    });
    project.links.forEach((link) => {
      items.push({ type: 'link', data: link });
    });
    project.notes.forEach((note) => {
      items.push({ type: 'note', data: note });
    });
    project.roomPlans.forEach((roomPlan) => {
      items.push({ type: 'room-plan', data: roomPlan });
    });
    project.moodboard.images.forEach((image) => {
      items.push({ type: 'image', data: image, moodboard: project.moodboard.id });
    });
  });

  res.status(httpStatus.OK).send({ habitat, items });
});

module.exports = {
  createHabitatForUser,
  getHabitatsForUser,
  getHabitat,
  getArchivedHabitats,
  updateHabitat,
  deleteHabitat,
  addUserToHabitat,
  removeUserFromHabitat,
  acceptHabitatInvite,
  getInspiration,
};
