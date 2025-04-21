const fs = require("fs");
require("dotenv").config();

const { get, post } = require("./services/bubble");

const bubbleKey = process.env.BUBBLE_API_KEY;

const omitFields = (obj, fields) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!fields.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

const run = async () => {
  let [courses, sections, lessons] = ["Courses", "Sections", "Lessons"].map(
    (type) => {
      const data = fs.readFileSync(`./data/${type}.json`, "utf8");
      return JSON.parse(data);
    }
  );

  sections = sections.filter((section) => {
    return courses.some((course) => course.Sections.includes(section.UniqueId));
  });

  lessons = lessons.filter((lesson) => {
    return sections.some((section) =>
      section.Lessons.includes(lesson.UniqueId)
    );
  });

  const currentCourses = await get("course", bubbleKey);
  if (currentCourses.count < courses.length) {
    for (let lesson of lessons) {
      if (!lesson.VideoLengthSeconds) continue;
      const { id } = await post(
        "lesson",
        omitFields(lesson, "UniqueId"),
        bubbleKey
      );
      lesson.BubbleId = id;
      console.log("lesson created", lesson.BubbleId);
    }
    for (let section of sections) {
      section.Lessons = section.Lessons.split(",")
        .map((l) => l.trim())
        .map((lesson) => {
          return lessons.find((l) => l.UniqueId === lesson).BubbleId;
        });

      const { id } = await post(
        "section",
        omitFields(section, "UniqueId"),
        bubbleKey
      );
      section.BubbleId = id;
      console.log("section created", section.BubbleId);
    }
    for (let course of courses) {
      course.Sections = course.Sections.split(",")
        .map((s) => s.trim())
        .map((section) => {
          return sections.find((s) => s.UniqueId === section).BubbleId;
        });
      const { id } = await post(
        "course",
        omitFields(course, "UniqueId"),
        bubbleKey
      );
      console.log("course created", id);
    }
  }
};

run();
