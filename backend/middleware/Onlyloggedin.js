//! A Middleware so that whenever client tries to access a page which is only accessible to loggedin user  at that situation this middleware is required
const jwt = require("jsonwebtoken");
const JWT_SECRET = "HelloWorldThisIsAfjal";

const Onlyloggedin = (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  let token = req.header("auth-token");
  //req.header becoz request from clientside will be inside header named as auth-token ,same name will be used in clientside inside header to make any request
  if (!token) {
   return res.status(401).json({ error: "No token found Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    //Verifying token from clientside with JWT_SECRET becoz data can be tampered by client but JWT_SECRET can't be.
    req.user = data;
    // add user from payload
    // A payload in API is the actual data pack that is sent with the GET method in HTTP
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};
module.exports = Onlyloggedin;
