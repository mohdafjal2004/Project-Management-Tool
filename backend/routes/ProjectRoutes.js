const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Onlyloggedin = require("../middleware/Onlyloggedin");
const Project = require("../models/ProjectModel");

//! ROUTE 1 :Creating a Project using POST /api/projects/createproject , Login Required
router.post(
  "/createproject",
  Onlyloggedin,
  [
    body("title", "title must be atleast 5 characters long").isLength({
      min: 5,
    }),
    body("details", "Please provide a valid email address").isLength({
      min: 10,
    }),
  ],
  async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, details, url, gitrepo } = req.body;
      // Validation for empty fields
      if (!title || !details || !url || !gitrepo) {
        return res.status(400).send("Please fill all the fields");
      }
      //Creating new Project
      const newProject = await Project.create({
        title,
        details,
        url,
        gitrepo,
        user: req.user.id,
        //assigning a userid to user so that whenever he creates a project so all project will be created on that same user id
      });
      return res.send(newProject);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send("Internal server error occured during creating a project");
    }
  }
);
//! ROUTE 2 : Getting projects of a user using GET /api/projects/getproject , Login Required
router.get("/getprojects", Onlyloggedin, async (req, res) => {
  try {
    const getProjects = await Project.find({ user: req.user.id });
    //don't use findById here becoz we already assigned a id inside within curly braces
    //here we are getting all projects of a user using user: req.user.id
    return res.send(getProjects);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .send("Internal server error occured during getting projects");
  }
});

// ! ROUTE 4 :Deleting a project of a user using DELETE /api/projects/deleteproject/:_id , Login Required

router.delete(
  "/deleteproject/:id",
  Onlyloggedin,

  async (req, res) => {
    try {
      //First find the project to be deleted
      var project = await Project.findById(req.params.id);
      if (!project) {
        return res
          .status(404)
          .send("Requested Project for updating do not exists");
      }
      if (project.user.toString() !== req.user.id) {
        // project.user.toString(); means the existing user who is currently accesing the notes
        // req.user.id; means loggedin user
        //Means allow updating to loggedin user if only he owns this note

        return res.status(401).send("Requested project not belongs to you");
      }
      //Finally deleting the project
      project = await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send("Internal server error occured during deleting project");
    }
  }
);
// ! ROUTE 3 :Updating  a project of a user using PUT /api/projects/updateproject/:_id , Login Required
//! Here remember to create a empty object in which all the updating can be made and saved
router.put(
  "/updateproject/:id",
  Onlyloggedin,

  async (req, res) => {
    const { title, details, url, gitrepo } = req.body;
    try {
      const changes = {};
      if (title) {
        //if we are getting title from user , then we will add it to newNote object , if not getting title it means user dont want to update note

        changes.title = title;
      }
      if (details) {
        changes.details = details;
      }
      if (url) {
        changes.url = url;
      }
      if (gitrepo) {
        changes.gitrepo = gitrepo;
      }

      //First find the project to be updated
      var project = await Project.findById(req.params.id);
      if (!project) {
        return res
          .status(404)
          .send("Requested Project for updating do not exists");
      }
      if (project.user.toString() !== req.user.id) {
        //toString() becoz data inside database is stored in JSON format so it is converted to string format for comparison
        return res.status(401).send("Requested project not belongs to you");
      }

      //Finally updating the project 
      //changes is the empty object where updating will be made
      project = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: changes },
        { new: true }
      );
      res.json({ project }); 
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send("Internal server error occured during updating project");
    }
  }
);

module.exports = router;
