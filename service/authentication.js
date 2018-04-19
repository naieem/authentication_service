import user from '../models/user';
import Joi from 'joi';
import middleware from '../middleware/middleware';
import redis from 'redis';

var redisClient = redis.createClient(); //creates a new client
/**
 * Schema definition for user to login 
 */
const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.string()
});

/**
 * Schema definition for newly registered user
 * with: required fields
 * without: not required fields
 * without: declared as key=>value pair.fields are in value array
 */
const registrationSchema = Joi.object().keys({
    email: Joi.string(),
    password: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    gender: Joi.string(),
    address: Joi.string()
}).with('email', 'password').without('dummyKey', ['address', 'lastname', 'gender']);

export default {
    login: login,
    registration: registration
}

/**
 * New user Registration 
 * @params {userInfo} 
 * @returns {Promise}
 */
function registration(userInfo) {
    return registrationSchema.validate(userInfo, (err, value) => {

        return new Promise((resolve, reject) => {
            if (err) {
                delete err.isJoi;
                delete err._object;
                reject(err);
            } else {
                // checking users existence using email
                checkIfUserExists(userInfo.email).then((response) => {
                    if (!response) {
                        user.create(userInfo, function(error, info) {

                            if (error) {
                                reject(error);
                            } else {
                                resolve(info);
                            }
                        });
                    } else {
                        reject({
                            "message": "user already exists with same email"
                        });
                    }
                }, (error) => {
                    reject(error);
                });
            }
        });
    });
}

/**
 * checking login information for user 
 * @params userinformaton
 */
function login(userinformaton) {
    // fields which will be returned in result( space seperated field name)
    var returningFields = 'email';
    return loginSchema.validate(userinformaton, (err, value) => {
        return new Promise((resolve, reject) => {
            if (!err) {
                user.find(userinformaton, returningFields, (error, userInfo) => {
                    if (!error) {
                        if (userInfo.length){
                            middleware.createToken(userinformaton).then((token) => {
                                // storing token to redis storage
                                redisClient.set(token,token,(error,value)=>{
                                    if(value){
                                        console.log('token saved in redis with id: ',token);
                                        // sending back token to client side
                                        userInfo[0].accessToken = token;
                                        resolve({
                                            status: true,
                                            data: {
                                                accessToken: token,
                                                userInfo:userInfo[0]
                                            }
                                        });
                                    }else{
                                        resolve({
                                            status: false,
                                            data: 'token not saved to redis'
                                        });
                                    }
                                });
                            });
                        }
                        else {
                            resolve({
                                status: false,
                                message: "user not found"
                            });
                        }
                    } else {
                        reject(error);
                    }
                });
            } else {
                delete err.isJoi;
                delete err._object;
                reject(err);
            }
        });
    });
}

/**
 * Checking users existance using email
 * @params {params}
 */
function checkIfUserExists(email) {
    return new Promise((resolve, reject) => {
        user.find({ email: email }, (error, value) => {
            if (!error) {
                if (value.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(error);
            }
        });
    });
}