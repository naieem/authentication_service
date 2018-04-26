import middleware from '../middleware/middleware';
import authService from '../service/authentication';

export default {
    login: login,
    authenticate: authenticate,
    registration: registration
}

function login(req, res, next) {
    authService.login(req.body).then((response) => {
        if (!response.status) {
            console.log(response.message);
            res.status(500).json({
                ErrorMessage: {
                    message: response.message
                }
            });
        } else {
            console.log('successfully created token and sent to as response');
            res.status(200).json({
                status: 200,
                data: response.data
            });
        }
    }, (error) => {
        console.log(error);
        res.status(500).json({
            ErrorMessage: {
                message: error
            }
        });
    });
}

function authenticate(req, res, next) {
    if (req.isValid) {
        res.status(200).json({
            isAuthenticated: req.isValid,
            userInfo: req.userInfo
        });
    } else {
        res.status(500).json({
            isAuthenticated: req.isValid,
            error: req.error
        });
    }
}

function registration(req, res, next) {

    authService.registration(req.body).then((response) => {

        res.status(200).json({
            status: 200,
            data: response
        });
    }, (error) => {

        res.status(500).json({
            status: 500,
            ErrorMessage: error
        });
    });
}