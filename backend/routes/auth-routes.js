import express from "express";
import { body, check } from "express-validator";
import UserController from "../controllers/auth-controllers.js";

import UserModel from '../models/user.js';

const router = express.Router();
const userController = new UserController();

router.post(
	"/signup",
    body('name').not().isEmpty(),
	body("email").trim().isEmail().normalizeEmail().custom(value=>{
        return UserModel.findOne({ email: value}).then(user=>{
            if( user){
                return Promise.reject('Email already exits');
            }
        })
    }),
	body("password").trim().isLength({ min: 5 }),
	userController.signup
);

export default router;
