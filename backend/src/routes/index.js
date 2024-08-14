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

//endpoint route to google auth
router.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
    function (req, res) {
        const { user, token } = req.user;
        setTokenCookies(res, token);

        res.status(200).json({ user, token });
    }
);

router.get('/auth/google/failure', (req, res) => {
    res.status(401).json({ message: 'Google Authentication Failed' });
});

export default router;
