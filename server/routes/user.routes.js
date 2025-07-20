import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes
router.route("/api/users").post(userCtrl.create);

// Protected routes
router.route("/api/users").get(authCtrl.requireSignin, authCtrl.requireAdmin, userCtrl.list);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorizationOrAdmin, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorizationOrAdmin, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
