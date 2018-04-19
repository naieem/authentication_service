import middleware from '../middleware/middleware';
import authService from '../service/authentication';

export default {
    login: function(req, res, next) {
        middleware.createToken(req.body).then((token) => {
            res.status(200).json({
                data: req.body,
                token: token
            });
        }, (error) => {
            res.status(500).json({
                error: error
            });
        });
    },
    authenticate: function(req, res, next) {
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
    },
    registration: function(req, res, next) {
        debugger;
        authService.registration(req.body).then((response) => {
            debugger;
            res.status(200).json({
                status: 200,
                data: response
            });
        }, (error) => {
            debugger;
            res.status(500).json({
                status: 500,
                ErrorMessage: error
            });
        });
    }

}