import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res
        .status(401)
        .send({ error: "Email and password don't match." });
    }
    
    console.log('signin: user found =', user._id);
    console.log('signin: user admin =', user.admin);
    
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 9999 });
    
    const responseData = {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    };
    
    console.log('signin: response data =', responseData);
    
    return res.json(responseData);
  } catch (err) {
    console.log('signin error:', err);
    return res.status(401).json({ error: "Could not sign in" });
  }
};
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

const hasAuthorizationOrAdmin = async (req, res, next) => {
  try {
    // 본인인지 확인
    const isOwner = req.profile && req.auth && req.profile._id == req.auth._id;
    
    if (isOwner) {
      return next();
    }
    
    // 본인이 아니면 admin 권한 확인
    let user = await User.findById(req.auth._id);
    if (!user || !user.admin) {
      return res.status(403).json({
        error: "User is not authorized",
      });
    }
    
    next();
  } catch (err) {
    console.log('hasAuthorizationOrAdmin error:', err);
    return res.status(403).json({
      error: "Authorization check failed",
    });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    console.log('requireAdmin: req.auth._id =', req.auth._id);
    let user = await User.findById(req.auth._id);
    console.log('requireAdmin: user found =', user ? 'yes' : 'no');
    console.log('requireAdmin: user.admin =', user ? user.admin : 'user not found');
    
    if (!user || !user.admin) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }
    next();
  } catch (err) {
    console.log('requireAdmin error:', err);
    return res.status(403).json({
      error: "User not found",
    });
  }
};

export default { signin, signout, requireSignin, hasAuthorization, hasAuthorizationOrAdmin, requireAdmin };
