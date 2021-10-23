import express from "express";
import { body, check } from "express-validator";

import Feed from "../controllers/feed-controllers.js";

const router = express.Router();
const feedController = new Feed();

// GET /feed/post
router.get("/posts", feedController.getPost);

// GET /feed/post:id
router.get("/posts/:id", feedController.getSinglePost);

// POST /feed/post
router.post(
	"/post",
	body("title").trim().isLength({ min: 5 }),
	body("content").trim().isLength({ min: 5 }),
	feedController.createPost
);

// PUT /feed/post/:id
router.put(
	"/post/:id",
	body("title").trim().isLength({ min: 5 }),
	body("content").trim().isLength({ min: 5 }),
	feedController.updatePost
);

router.delete("/post/:id", feedController.deletePost);

export default router;
