import user from '../models/user';
import Joi from 'joi';
const loginSchema = Joi.object({
    email: Joi.string(),
    password: Joi.string()
});

var authenticator = {
    /**
     * checking login information for user 
     * @params userinformaton
     */
    login: function(userInfo) {
        loginSchema.validate(userInfo, (err, value) => {
            debugger;
        });
        // user.find({ name: 'john', age: { $gte: 18 }},function(err,information){

        // });
    },
    registration: function(userInfo) {
        return loginSchema.validate(userInfo, (err, value) => {
            debugger;
            return new Promise((resolve, reject) => {
                if (err) {
                    delete err.isJoi;
                    delete err._object;
                    reject(err);
                } else {
                    user.create(userInfo, function(error, info) {
                        debugger;
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    })
                }
            });
        });
    }
}
export default authenticator;