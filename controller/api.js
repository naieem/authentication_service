import middleware from '../middleware/middleware';

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
    }

}