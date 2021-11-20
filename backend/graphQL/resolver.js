import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import validator from 'validator';

import User from '../models/user.js';

const characterResolver = {
    hello(){
        return{
            text: 'hello', 
            views: 1234
        }
    }
}

const signupResolver = {
    signup: async function(args, req){
        const email = args.userInput.email;
        const name = args.userInput.name;
        const password = args.userInput.password;

        // validation
        let errors = [];
        if( !validator.isEmail(email) ){
            errors.push({message:'invalid email address'});
        }


        if(!validator.isLength(password, {min: 5})) {
            console.log('password length', password.length);
            errors.push({message:'Password is too short. Password must be at least 5 characters'});
        }

        if(errors.length > 0){
            const err = new Error('Invalid Input. Please try again');
            err.data = errors;
            err.code = 422;
            throw err;
        }

        // check if email already in use
        const existingUser = await User.findOne({ email:email});

        if( existingUser){
            const err = new Error(`User ${email} already exists`);
            err.code = 422;
            throw err;
        }

        //hash password
        const hashPassword = await bcrypt.hash(password,12);

        // create new user
        const user = new User({
            email: email,
            name: name, 
            password: hashPassword
        })

        const storedUser = await user.save();
        return { ...storedUser._doc, _id: storedUser._id.toString() };

    }
}

export {characterResolver,signupResolver}