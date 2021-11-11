import UserModel from "../models/user.js";

class UserController {
	// [GET] /user/getStatus
	getStatus = async (req, res, next) => {
		const id = req.userId;

		try {
			const user = await UserModel.findById(id);
			if (!user) {
				const err = new Error("Error when fetching user");
				err.statusCode = 404;
				throw err;
			}
			res.status(200).json({
				message: "fetch status successfull",
				status: user.status,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}

		// UserModel.findById(id)
		// 	.then((user) => {
		// 		if (!user) {
		// 			const err = new Error("Error when fetching user");
		// 			err.statusCode = 404;
		// 			throw err;
		// 		}

		// 		// console.log("User status", user.status);

		// 		res.status(200).json({
		// 			message: "fetch status successfull",
		// 			status: user.status,
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		if (!err.statusCode) {
		// 			err.statusCode = 500;
		// 		}
		// 		next(err);
		// 	});
	};

	// [POST] /user/updateStatus
	updateStatus = async (req, res, next) => {
		const newStatus = req.body.status;
		const id = req.userId;

		try {
			const user = await UserModel.findById(id);
			if (!user) {
				const err = new Error("Error when fetching user to update status");
				err.statusCode = 404;
				throw err;
			}
			user.status = newStatus;

			const result = await user.save();
			res.status(201).json({
				message: "Update successful",
				status: result.status,
			});
		} catch (err) {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}

		
	};
}

export default UserController;
