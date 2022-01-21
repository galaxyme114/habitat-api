const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if (user) {
    await emailService.sendWelcomeVerificationEmail(user.firstName, user.email, '');
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const me = catchAsync(async (req, res) => {
  // const { user } = req;
  const user = await userService.getUserById(req.user._id);
  res.send({ user: user.toJSON() });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({ message: 'Please check your email for a password reset link.' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.send({ message: 'Your password has been reset' });
});

const validateEmail = catchAsync(async (req, res) => {
  await authService.validateEmail(req.body.email, req.body.id);
  res.send({ valid: true, message: 'Email can be used' });
});

const update = catchAsync(async (req, res) => {
  await authService.update(req.user.id, req.body);
  res.send({ message: 'User updated' });
});

module.exports = {
  register,
  login,
  me,
  refreshTokens,
  forgotPassword,
  resetPassword,
  validateEmail,
  update,
};
