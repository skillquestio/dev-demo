const { generateRandomString, generateRandomDate } = require("./rnd");

const generateBubbleId = () => {
  return [Date.now(), "x", generateRandomString(18, { numbers: true })].join(
    ""
  );
};

const createBubbleObject = (creator = null) => {
  const uniqueId = generateBubbleId();
  const createdDate = generateRandomDate(100);
  const modifiedDate = createdDate;

  const obj = {
    uniqueId,
    createdDate,
    modifiedDate,
  };
  if (creator) {
    obj.creator = creator;
  }
  return obj;
};

module.exports = {
  generateBubbleId,
  createBubbleObject,
};
