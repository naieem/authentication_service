import middleware from '../middleware/middleware';
import authService from '../service/authentication';

export default {
    login: login,
    authenticate: authenticate,
    registration: registration

}

function login(req, res, next) {
    authService.login(req.body).then((response) => {
        debugger;
        if (!response.status) {
            res.status(500).json({
                ErrorMessage: {
                    message: response.message
                }
            });
        } else {
            res.status(200).json({
                status: 200,
                data: response.data
            });
        }
    }, (error) => {

    });
    // middleware.createToken(req.body).then((token) => {
    //     res.status(200).json({
    //         data: req.body,
    //         token: token
    //     });
    // }, (error) => {
    //     res.status(500).json({
    //         error: error
    //     });
    // });
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