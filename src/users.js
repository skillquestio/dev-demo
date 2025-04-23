require("dotenv").config();
const { writeToFile } = require("./util/file");
const { user } = require("./objects");
const { post } = require("./services/bubble");
const { batchPromises } = require("./util/requests");
const path = require("path");
const bubbleKey = process.env.BUBBLE_API_KEY;

const run = async () => {
  const users = Array.from({ length: 20 }, () => user());

  const postUserToBubble = async (user) => {
    const { id } = await post("user", user, bubbleKey);
    user.BubbleId = id;
    console.log("User created", user.BubbleId);
    return user;
  };

  const updatedUsers = await batchPromises(users, 10, postUserToBubble);
  console.log("All users posted to Bubble API");

  writeToFile(
    path.join(process.cwd(), "data", "Users.json"),
    JSON.stringify(updatedUsers, null, 2)
  );
  console.log("Users written to data/Users.json");
};

run();
