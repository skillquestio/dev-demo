require("dotenv").config();
const { writeToFile } = require("./util/file");
const { user } = require("./objects");
const { post } = require("./services/bubble");
const { batchPromises } = require("./util/requests");
const fs = require("fs");
const path = require("path");
const bubbleKey = process.env.BUBBLE_API_KEY;

const run = async () => {
  const users = Array.from({ length: 20 }, () => user());
  const filePath = path.join(process.cwd(), "data", "Users.json");

  const postUserToBubble = async (user) => {
    const { id } = await post("user", user, bubbleKey);
    user.BubbleId = id;
    console.log("User created", user.BubbleId);
    return user;
  };

  const updatedUsers = await batchPromises(users, 10, postUserToBubble);
  console.log("All users posted to Bubble API");

  let existingUsers = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    existingUsers = JSON.parse(fileContent);
  }

  const allUsers = [...existingUsers, ...updatedUsers];

  writeToFile(filePath, JSON.stringify(allUsers, null, 2));
  console.log("Users appended to data/Users.json");
};

run();
