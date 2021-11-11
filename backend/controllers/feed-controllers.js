import fs from "fs";
import path from "path";

import { validationResult } from "express-validator";
import PostModel from "../models/post.js";
import UserModel from "../models/user.js";

class Feed {
	// GET /feed/posts

	getPost = async (req, res, next) => {
		const perPage = 3;
		const currentPage = +req.query.page || 1;
		console.log("currentPage", currentPage);

		try {
			const totalPage = await PostModel.find({}).countDocuments();
			// let totalPage
			const posts = await PostModel.find({})
				.skip((currentPage - 1) * perPage)
				.limit(perPage);

			res.status(200).json({
				posts: posts,
				totalItems: totalPage,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	};

	// GET /feed/posts/:id
	getSinglePost = async (req, res, next) => {
		const id = req.params.id;

		try {
			const post = await PostModel.findById(id).populate("creator");
			if (!post) {
				const error = new Error("Cannot find Post");
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				message: "Fetch post successfuly",
				post: post,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}

		// PostModel.findById(id)
		// 	.populate("creator")
		// 	.then((post) => {
		// 		if (!post) {
		// 			const error = new Error("Cannot find Post");
		// 			error.statusCode = 404;
		// 			throw error;
		// 		}

		// 		res.status(200).json({
		// 			message: "Fetch post successfuly",
		// 			post: post,
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		if (!err.statusCode) {
		// 			err.statusCode = 500;
		// 		}
		// 		next(err);
		// 	});
	};

	// POST /feed/post
	createPost = async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors);
			const error = new Error("Validation failed");
			error.statusCode = 422;
			throw error;
		}
		// const image = req.file;
		console.log("req.file: ", req.file);
		if (!req.file) {
			const error = new Error("No image provided");
			error.statusCode = 422;
			throw error;
		}
		const imgUrl = req.file.path;
		const { title, content } = req.body;
		//validate errors
		const post = new PostModel({
			title,
			imgUrl: imgUrl,
			content,
			creator: req.userId,
		});

		let creator;

		try {
			const result = await post.save();
			console.log(result);
			const user = await UserModel.findById(req.userId);
			if (!user) {
				const error = new Error("Cannot find user");
				error.statusCode = 404;
				throw error;
			}

			creator = user;
			user.posts.push(post);
			await user.save();

			res.status(201).json({
				message: "Created successfuly",
				post: post,
				creator: { _id: creator._id, name: creator.name },
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	};

	updatePost = async (req, res, next) => {
		// console.log('update ddi')

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("errors", errors);
			const error = new Error("Validation failed");
			error.statusCode = 422;
			throw error;
		}

		const postId = req.params.id;
		const title = req.body.title;
		const content = req.body.content;
		let imgUrl = req.body.image;

		if (req.file) {
			imgUrl = req.file.path;
		}
		if (!imgUrl) {
			const error = new Error("No image provided");
			error.statusCode = 404;
			throw error;
		}

		// console.log('cac ket qua can co: ',title, content, imgUrl);
		// console.log('postid', postId);
		try {
			const post = await PostModel.findById(postId);
			if (!post) {
				const error = new Error("Cannot find Post");
				error.statusCode = 404;
				throw error;
			}

			if (req.userId.toString() !== post.creator.toString()) {
				const error = new Error("Unauthorized");
				error.statusCode = 402;
				throw error;
			}

			if (imgUrl !== post.imgUrl) {
				clearImage(post.imgUrl);
			}
			post.title = title;
			post.content = content;
			post.imgUrl = imgUrl;

			const result = await post.save();
			res.status(200).json({
				message: "Update post successfuly",
				post: result,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}

		
	};

	deletePost =  async (req, res, next) => {
		const id = req.params.id;
		
		try {
			const post = await PostModel.findById(id);
			if (!post) {
				const error = new Error("Cannot find Post");
				error.statusCode = 404;
				throw error;
			}
			if (req.userId.toString() !== post.creator.toString()) {
				const error = new Error("Unauthorized");
				error.statusCode = 402;
				throw error;
			}

			clearImage(post.imgUrl);
			const result = await PostModel.findByIdAndDelete(id);

			let user = await UserModel.findById(req.userId);
			// let newPosts = user.posts.filter(p => p.toString() !== docs._id.toString());
			// console.log('newPosts', newPosts);

			// to remove elements from arr in mongoose --> use ' pull ' for simplicity
			user.posts.pull(id);

			await user.save();
			res.status(200).json({
				message: "Post deleted successfully",
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
		
	};
}

const clearImage = (filePath) => {
	// filePath = path.join(__dirname,'..', filePath);
	fs.unlink(filePath, (err) => {
		console.log(err);
	});
};

export default Feed;
