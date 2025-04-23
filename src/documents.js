const fs = require("fs");
require("dotenv").config();

const { get, post, login } = require("./services/bubble");
const { omitFields, batchPromises } = require("./util/requests");

const bubbleKey = process.env.BUBBLE_API_KEY;

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

  sections = sections.filter((section) => {
    return courses.some((course) => course.Sections.includes(section.UniqueId));
  });

  lessons = lessons.filter((lesson) => {
    return sections.some((section) =>
      section.Lessons.includes(lesson.UniqueId)
    );
  });

  const currentCourses = await get("course", bubbleKey);
  lessons = await batchPromises(
    lessons.filter((lesson) => lesson.VideoLengthSeconds),
    10,
    async (lesson) => {
      const { id } = await post(
        "lesson",
        omitFields(lesson, "UniqueId"),
        bubbleKey
      );
      lesson.BubbleId = id;
      console.log("lesson created", lesson.BubbleId);
      return lesson;
    }
  );

  sections = await batchPromises(sections, 10, async (section) => {
    section.Lessons = section.Lessons.split(",")
      .map((l) => l.trim())
      .filter((l) => !!l)
      .map((lesson) => {
        return lessons.find((l) => l.UniqueId === lesson)?.BubbleId;
      })
      .filter((l) => !!l);

    const { id } = await post(
      "section",
      omitFields(section, "UniqueId"),
      bubbleKey
    );
    section.BubbleId = id;
    console.log("section created", section.BubbleId);
    return section;
  });

  await batchPromises(courses, 10, async (course) => {
    course.Sections = course.Sections.split(",")
      .map((s) => s.trim())
      .filter((s) => !!s)
      .map((section) => {
        return sections.find((s) => s.UniqueId === section)?.BubbleId;
      })
      .filter((s) => !!s);

    try {
      const { id } = await post(
        "course",
        omitFields(course, "UniqueId"),
        bubbleKey
      );
      console.log("course created", id);
    } catch (error) {
      console.error("Error creating course:", course, error);
      throw error;
    }
  });

  for (const user of users) {
    const { token } = await login(user.email, user.password);
    for (let course of courses) {
      const isStarted = Math.random() > 0.5;
      if (!isStarted) {
        continue;
      }
      const courseLessons = sections
        .filter((s) => course.Sections.includes(s.BubbleId))
        .flatMap((s) => s.Lessons)
        .map((lessonId) => lessons.find((l) => l.BubbleId === lessonId));

      const isCompleted = Math.random() > 0.9;
      const lessonsCompleted = isCompleted
        ? courseLessons.length
        : Math.floor(Math.random() * courseLessons.length);

      courseLessons.slice(0, lessonsCompleted).forEach(async (lesson) => {
        const postData = {
          Lesson: lesson.BubbleId,
          WatchTimeSeconds: lesson.VideoLengthSeconds,
        };
        try {
          await post("LessonViewHistory", postData, token);
          console.log("Lesson view history created for user", user.email);
        } catch (error) {
          console.error("Error creating lesson view history:", error);
        }
      });
    }
  }
};

run();
