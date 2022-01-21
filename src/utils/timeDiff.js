/**
 * Covert ISODate String to user-friendly date format
 * @param {String} ISODateString
 * @returns {String} Formated DateString
 */
const formatDate = (ISODateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(ISODateString).toLocaleDateString(undefined, options);
};

/**
 * Create an object composed of the picked object properties
 * @param {timestap} timestamp
 * @returns {string}
 */
const getTimeDiff = (ISODateTimestamp) => {
  if (!ISODateTimestamp) {
    return 'Unknown';
  }

  // Current time
  const ctime = new Date().getTime() / 1000;

  // Past time
  const ptime = new Date(ISODateTimestamp).getTime() / 1000;

  // Now calc the difference between the two times
  const timeDiff = Math.floor(Math.abs(ctime - ptime) / 60);

  // Now we need find out whether or not the time difference needs to be in
  // minutes, hours, or days

  let niceTimeDiff = '';
  if (timeDiff < 2) {
    niceTimeDiff = 'Right now';
  } else if (timeDiff > 2 && timeDiff < 60) {
    niceTimeDiff = `${Math.floor(Math.abs(timeDiff))} minutes ago`;
  } else if (timeDiff >= 60 && timeDiff < 120) {
    niceTimeDiff = `${Math.floor(Math.abs(timeDiff / 60))} hour ago`;
  } else if (timeDiff < 1440) {
    niceTimeDiff = `${Math.floor(Math.abs(timeDiff / 60))} hours ago`;
  } else if (timeDiff > 1440 && timeDiff < 2880) {
    niceTimeDiff = `${Math.floor(Math.abs(timeDiff / 1440))} days ago`;
  } else if (timeDiff > 2880) {
    niceTimeDiff = formatDate(ISODateTimestamp);
  }

  return niceTimeDiff;
};

module.exports = getTimeDiff;
