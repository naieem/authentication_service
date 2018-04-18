import jwt from 'jsonwebtoken';
import fs from "fs";

var public_key = fs.readFileSync('./keys/public.pem'); // get public key
var private_key = fs.readFileSync('./keys/private.pem'); // get public key

var execute = {
    verifyToken: function(req, res, next) {
        //return new Promise((resolve, reject) => {
        if (req.headers && req.headers.authorization) {
            jwt.verify(req.headers.authorization, public_key, function(err, decoded) {
                if (!err) {
                    console.log(decoded);
                    req.userInfo = decoded;
                    req.isValid = true;
                    next();
                } else {
                    req.isValid = false;
                    req.error = err;
                    next();
                }
            });
        }
    },
    createToken: function(data) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, public_key, { expiresIn: '2m' }, (error, token) => {
                if (error || !token) {
                    reject(error);
                }
                resolve(token);
            });
        });
    }
}

export default execute;