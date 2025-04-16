const { createBubbleObject } = require("../util/bubble");
const { getRandomFirstName, getRandomLastName } = require("../util/names");
const { generateRandomString } = require("../util/rnd");

module.exports = () => {
  return {
    ...createBubbleObject(),
    email: `demo+${generateRandomString(8)}@skillquest.io`,
    firstName: getRandomFirstName(),
    lastName: getRandomLastName(),
  };
};
