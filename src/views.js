require("dotenv").config();
const { post, login } = require("./services/bubble");
const fs = require("fs");

const bubbleKey = process.env.BUBBLE_API_KEY;

const generateViewPromise = (lesson, userToken) => {
  const postData = {
    Lesson: lesson.BubbleId,
  };
  return post("LessonViewHistory");
};

const run = async () => {
  let [users, courses, sections, lessons] = [
    "Users",
    "Courses",
    "Sections",
    "Lessons",
  ].map((type) => {
    const data = fs.readFileSync(`./data/${type}.json`, "utf8");
    return JSON.parse(data);
  });

  for (const user of users) {
    const res = await login(user.email, user.password);
    console.log(res);
  }

  // sections = sections.filter((section) => {
  //   return courses.some((course) => course.Sections.includes(section.UniqueId));
  // });

  // lessons = lessons.filter((lesson) => {
  //   return sections.some((section) =>
  //     section.Lessons.includes(lesson.UniqueId)
  //   );
  // });
};

run();
