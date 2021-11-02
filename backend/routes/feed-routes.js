import express from "express";
import { body, check } from "express-validator";

import isAuth from "../middleware/is-auth.js";

import Feed from "../controllers/feed-controllers.js";

const router = express.Router();
const feedController = new Feed();

// GET /feed/post
router.get("/posts", isAuth, feedController.getPost);

// GET /feed/post:id
router.get("/posts/:id", isAuth, feedController.getSinglePost);

// POST /feed/post
router.post(
	"/post",
	body("title").trim().isLength({ min: 5 }),
	body("content").trim().isLength({ min: 5 }),
	isAuth,
	feedController.createPost
);

// PUT /feed/post/:id
router.put(
	"/post/:id",
	body("title").trim().isLength({ min: 5 }),
	body("content").trim().isLength({ min: 5 }),
	isAuth,
	feedController.updatePost
);

router.delete("/post/:id",isAuth, feedController.deletePost);

export default router;
