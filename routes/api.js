import express from 'express';
import middleware from '../middleware/middleware';
import api from '../controller/api';
var router = express.Router();

// router.use(middleware.vrifyToken);
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(200, "api route works");
});
// router.use(middleware.vrifyToken);
router.post('/login', api.login);
router.post('/authenticate', middleware.verifyToken, api.authenticate);
router.post('/registration', api.registration);

export default router;