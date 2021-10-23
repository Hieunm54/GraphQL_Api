import UserModel from "../models/user.js";

import bcrypt from "bcryptjs";

import { validationResult } from "express-validator";

class UserController {

	// POST /auth/signup
	signup = (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = new Error("Validation fail");
			err.statusCode = 422;
			err.data = errors.array();
			throw err;
		}

		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;

		//hash pw
		bcrypt
			.hash(password, 12)
			.then((hashPassword) => {
				const user = new UserModel({
					email: email,
					name: name,
					password: hashPassword,
				});
				return user.save();
			})
			.then((result) => {
				res.status(200).json({
					message: "Signup successful",
					userId : result._id
				});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	};
}

export default UserController;
