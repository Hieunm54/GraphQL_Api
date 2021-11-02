import path from "path";

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

import feedRoute from "./routes/feed-routes.js";
import authRoute from "./routes/auth-routes.js";
import userRoute from './routes/user-routes.js';

const __dirname = path.resolve();

// multer config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "images/");
	},
	filename: function (req, file, cb) {
		const uniquePrefix = new Date().toISOString() + "-" + file.fieldname+'.png';
		cb(null, uniquePrefix);
	},
});

const fileFilter = function (req, file, cb) {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/jpg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};


const app = express();

// use multer as a middle
app.use( multer({ storage: storage, fileFilter: fileFilter }).single('image') );


//dotenv config
dotenv.config();

// set cors
app.options('*', cors());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static file
app.use("/images", express.static(path.join(__dirname, "/images")));

//config routes
app.use("/feed", feedRoute);
app.use('/auth',authRoute);
app.use('/user',userRoute);

// error handlers
app.use((errors, req, res, next) => {
	console.log(errors);
	const { statusCode, message } = errors;
	if (!statusCode) {
		statusCode = 500;
	}
	const data = errors.data;
	res.status(statusCode).json({ message, data });
});

// db connection
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		app.listen(8080, () => {
			console.log("listening on 8080");
		});
	})
	.catch((err) => console.log(err));
