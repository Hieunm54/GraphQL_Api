import express from "express";

import UserController from '../controllers/user-controllers.js';
import isAuth from '../middleware/is-auth.js';
const userController = new UserController();
const router = express.Router();

router.get('/getStatus',isAuth,userController.getStatus);
router.patch('/updateStatus',isAuth,userController.updateStatus);


export default router;