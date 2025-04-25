# Skillquest Demo Project

This project is designed to show off your Bubble.io talents for a potential role as an application developer at Skillquest, where we teach technical skills using video games. The intent of the project was covered in [the job post](/job-post.md), and the setup and requirements are covered here.

## Requirements

Using the blank application with dummy data provided to you by Skillquest and your skills as a Bubble.io developer, create two front-end pages:

1. A search interface page which generates a list of users for which data will be displayed

- Allows a user to search for users by:
  - User's email
  - User's total watch time
  - Which courses they have started (they have at least one LessonViewHistory)
  - How far they have progressed through the course (as a percentage of total length)
- Saves the search parameters to the url so that a link can be generated to to search criteria
- Contains a button to view the data for the selected users

2. A metrics dashboard that allows the viewing of the data for the filters selected on page 1

- Displays aggregate data for:
  - Number of courses contained in the query
  - Number of lessons viewed
  - Number of unique users in the data
  - Average completion percentage of the course
- Allows for .csv download of the user data which includes unique records for each user/course:
  - User email
  - Course
  - Total watch time
- Includes any further information or views that you think will set your project apart amongst the other participants in this project

The demo app is yours to modify in any way that you feel puts your best foot forward. With any questions, please reach out to the Skillquest team.

You're encouraged to show off what you can do, if you'd like to make further adjustments (e.g. accounts, other pages, animations, etc...).

## Demo App Setup

First, we will set up the Bubble application. It will come with data types and demo data, which you may also expand upon using our demo data scripts if you see fit.

To set up the Bubble application:

1. You will be given access via email to a copy of a Bubble.io application that is mostly blank, but contains relevant data types fo Skillquest's main application
2. Now that you have a copy of your own, use Bubble's free tier to upgrade your application to "Starter" for the duration of the demo.

- You will not be charged as long as you transfer your project to the ownership of product@skillquest.io before the end of the trial
- The Starter plan is needed in order to deploy your application

3. Hit the Deploy button to initiate your production app's deployment
4. Use the "App data > Copy and restore database > Copy development data into Live database" functionality in order to sync data between your development and live branches

## Data Reset

While your Bubble app comes with demo data, if you find yourself needing to reset the data within your application, or needing to generate new data, you can use the scripts within this repository to manage and generate new data. First, you need to make sure your Bubble app's Data API is enabled. Follow the steps below to manage your demo data:

1. On the "API" tab in your Bubble app's settings, ensure the checkbox "Enable Data API" if it is not already checked, and ensure that the boxes are checked for each data type
2. Record the "Data API Root URL" (you will need it for a future step)
3. Click the button "Generate a new API token" and record the token's value (you will need it for a future step)

The next steps will use this script and the Bubble Data API to fill your application with starter data.

1. Pull this repo from GitHub
2. Create a file in the repo's directory called ".env" then add 2 environment variables to the .env file:

- BUBBLE_API_URL=<value from step 2 above>
- BUBBLE_API_KEY=<value from step 3 above>
- See below screenshots as an example of where the .env file should live and what it should contain

![environment variable setup](/walkthrough/env.png)

5. With Node.js installed, run `npm install`

You can now:

- Generate new users with `npm run generate-users`
- Create new Lessons, Sections, and Courses with `npm run generate-documents`
- Delete/clear any collection of data using the bulk backend workflows within the Bubble application data interface

Note that `users` are required in order for the `generate-documents` script to run properly. The process is designed so that you generate the courses/sections/lessons/views a single time after generating the users.
