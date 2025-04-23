require("dotenv").config();
const { get } = require("./services/bubble");

const bubbleKey = process.env.BUBBLE_API_KEY;

const run = async () => {
  const users = await get("users", bubbleKey);

  console.log(users);
};

run();
