const { createBubbleObject } = require("../util/bubble");
const { getRandomFirstName, getRandomLastName } = require("../util/names");
const { generateRandomString } = require("../util/rnd");

module.exports = () => {
  return {
    email: `demo+${generateRandomString(8)}@example.com`,
    password: generateRandomString(12),
    FirstName: getRandomFirstName(),
    LastName: getRandomLastName(),
  };
};
