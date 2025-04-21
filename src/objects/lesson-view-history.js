const { createBubbleObject } = require("../util/bubble");

module.exports = (creator) => {
  return {
    ...createBubbleObject(creator),
  };
};
