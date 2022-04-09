const mongoose = require("mongoose"); 
const connectToDB = () => {
  mongoose
    .connect(
      "mongodb+srv://projecttool:projecttool@cluster0.dvbpo.mongodb.net/projectTool?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected to DB sucessfully");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = connectToDB
