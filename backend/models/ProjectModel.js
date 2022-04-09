const mongoose = require("mongoose");
const { Schema } = mongoose;

const userProjects = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  gitrepo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Project = mongoose.model("projects", userProjects);
module.exports = Project;
