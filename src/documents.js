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

const batchPromises = async (items, batchSize, fn) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
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
  }
};

run();
