import UserModel from "../models/user.js";

class UserController {
	// [GET] /user/getStatus
	getStatus = (req, res, next) => {
		const id = req.userId;

		UserModel.findById(id)
			.then((user) => {
				if (!user) {
					const err = new Error("Error when fetching user");
					err.statusCode = 404;
					throw err;
				}

				// console.log("User status", user.status);

				res.status(200).json({
					message: "fetch status successfull",
					status: user.status,
				});
			})
			.catch((err) => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	};

	// [POST] /user/updateStatus
	updateStatus = (req, res, next) => {
		const newStatus = req.body.status;
		const id = req.userId;


		UserModel.findById(id)
			.then((user) => {
                if (!user) {
					const err = new Error("Error when fetching user to update status");
					err.statusCode = 404;
					throw err;
				}
                
                user.status = newStatus;
                return user.save();
				
			}).then(result=>{

                res.status(201).json({
					message: "Update successful",
					status: result.status,
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
