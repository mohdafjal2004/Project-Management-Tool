const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Onlyloggedin = require("../middleware/Onlyloggedin");

//JWT_SECRET
const JWT_SECRET = "HelloWorldThisIsAfjal";

//! ROUTE:1 = Creating a user using POST : /api/auth/createuser . No login Required
router.post(
  "/createuser",
  [
    body("name", "Name must be atleast 5 characters long").isLength({ min: 5 }),
    body("email", "Please provide a valid email address").isEmail(),
    body("password", "Password must be atleast 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      //check whether user exists
      var newUser = await User.findOne({ email });
      if (newUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      //Generating salt
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      //Creating a user
       newUser = await User.create({
        name,
        email,
        password: hashedpassword,
      });
      //defining the type of data for sending into the token for verifying
      let data = {
        id: newUser.id,
      };
      //Using data and JWT_SECRET for signing the token from backend
      const authTokensignup = jwt.sign(data, JWT_SECRET);
      res.json({ authTokensignup });
    } catch (error) {
      //error handling when server is not responding
      console.log(error.message);
      res
        .status(500)
        .send("Internal server error occured during registering a user");
    }
  }
);
//! ROUTE:2 = Authenticating a user using POST : /api/auth/loginuser . No login Required
router.post(
  "/loginuser",
  [
    body("email", "Please provide a valid email address").isEmail(),
    body("password", "Password must be atleast 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      //Authentication starts
      var user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send("Invalid Creadentials");
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(401).send("Invalid Creadentials");
      }

      //defining the type of data for sending into the token for verifying
      let data = {
        id: user.id,
      };
      //Using data and JWT_SECRET for signing the token from backend
      const authTokenlogin = jwt.sign(data, JWT_SECRET);
      res.json({ authTokenlogin });
    } catch (error) {
      //error handling when server is not responding
      console.log(error);
      res
        .status(500)
        .send("Internal server error occured during authenticating a user");
    }
  }
);
//! ROUTE:3 = Getting details a user using GET : /api/auth/fetchuser .  Login Required
router.get("/fetchuser", Onlyloggedin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Internal server error occured during fetching  user details");
  }
});

module.exports = router;
