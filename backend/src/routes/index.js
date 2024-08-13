import express from 'express';
import UserRoutes from './user.js';
import TicketsRoutes from './tickets.js';
import fileUpload from '../controllers/fileUpload.js';
import upload from '../multerconfig/storageConfig.js';
import passport from "passport";
import "../common/googleStrategy.js";
import setTokenCookies from '../common/setTokenCookies.js';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/tickets', TicketsRoutes);
router.post('/upload', upload.single('file'), fileUpload);

// FE use this endpoint ( /auth/google ) route to google auth
router.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login` }),
    function (req, res) {
        const { user, token } = req.user;
        setTokenCookies(res, token);

        //TODO
        res.redirect(`${process.env.FRONTEND_HOST}/homePage`);
    }
);

export default router;
