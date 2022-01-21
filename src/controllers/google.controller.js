const { google } = require('googleapis');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const customsearch = google.customsearch('v1');

const extraSearchTerms = ' interior design';

const post = catchAsync(async (req, res) => {
  const { terms, start } = req.body;
  let startIndex = 0;

  if (start) {
    startIndex = start;
  }

  const result = await customsearch.cse.list({
    cx: config.google.cx,
    auth: config.google.key,
    searchType: 'image',
    q: terms + extraSearchTerms,
    start: startIndex,
    safe: 'active',
    rights: 'cc_publicdomain cc_attribute nonderived cc-sharealike',
  });

  res.send(result);
});

module.exports = {
  post,
};
