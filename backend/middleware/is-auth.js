import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuth = (req,res, next)=>{
    const authorization = req.get('authorization');


    if( !authorization){
        const error = new Error('Invalid authorization');
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1];
    let decodedToken;
    // verify token
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(err){
        err.statusCode = 402;
        throw err;
    }

    // check if decodedToken is verify successful or not
    if(!decodedToken){
        const error = new Error('Not authenticated ');
        error.statusCode = 402;
        throw error;
    }

    req.userId = decodedToken.userId;
    // console.log('req.userId', req.userId);
    next();

}

export default isAuth;