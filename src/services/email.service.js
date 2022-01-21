const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
// const postmark = require('postmark');
const config = require('../config/config');
const logger = require('../config/logger');

// const transport = nodemailer.createTransport(config.email.smtp);
const transport = nodemailer.createTransport(postmarkTransport({ auth: { apiKey: config.email.postmarkApiKey } }));

/* istanbul ignore next */
// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  logger.info(JSON.stringify(msg));
  try {
    const info = await transport.sendMail(msg);
    logger.info(JSON.stringify(info));
  } catch (error) {
    logger.info(JSON.stringify(error));
  }
};

/**
 * Send reset password email
 * @param {string} recipientEmail
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (recipientEmail, token) => {
  const resetPasswordUrl = `${config.appUrl}/reset-password/?token=${token}`;

  const mail = {
    from: config.email.from,
    to: recipientEmail,
    templateId: config.email.resetPasswordTemplateId,
    templateModel: {
      action_url: resetPasswordUrl,
    },
  };

  await transport.sendMail(mail);
};

/**
 * Send welcome email
 * @param {string} firstName
 * @param {string} recipientEmail
 * @param {string} emailConfirmationUrl
 * @returns {Promise}
 */
const sendWelcomeVerificationEmail = async (firstName, recipientEmail, emailConfirmationUrl) => {
  const mail = {
    from: config.email.from,
    to: recipientEmail,
    templateId: config.email.welcomeTemplateId,
    templateModel: {
      name: firstName,
      product_name: config.companyName,
      action_url: emailConfirmationUrl,
      support_email: '', // TODO
      help_url: '', // TODO
    },
  };

  await transport.sendMail(mail);
};

/**
 * Send User invite email, for users with no existing account
 * @param {string} recipientEmail
 * @param {string} senderName
 * @param {string} token
 */
const sendNewUserInviteEmail = async (recipientEmail, senderName, token) => {
  const inviteUrl = `${config.appUrl}/habitats/invite/?token=${token}`;
  const mail = {
    from: config.email.from,
    to: recipientEmail,
    templateId: config.email.inviteTemplateId,
    templateModel: {
      invite_sender_name: senderName,
      product_name: config.companyName,
      action_url: inviteUrl,
      support_email: '', // TODO
      help_url: '', // TODO
    },
  };
  await transport.sendMail(mail);
};

/**
 * Send User invite email, for users with an existing account
 * @param {string} recipientEmail
 * @param {string} recipientName
 * @param {string} senderName
 * @param {string} token
 */
const sendExistingUserInviteEmail = async (recipientEmail, recipientName, senderName, token) => {
  const acceptInviteUrl = `${config.appUrl}/habitats/invite/?token=${token}`;
  const mail = {
    from: config.email.from,
    to: recipientEmail,
    templateId: config.email.acceptInviteTemplateId,
    templateModel: {
      invite_sender_name: senderName,
      name: recipientName,
      product_name: config.companyName,
      action_url: acceptInviteUrl,
      support_email: '', // TODO
      help_url: '', // TODO
    },
  };
  await transport.sendMail(mail);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendWelcomeVerificationEmail,
  sendNewUserInviteEmail,
  sendExistingUserInviteEmail,
};
