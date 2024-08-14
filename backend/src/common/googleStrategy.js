import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import users from "../models/user.js";
import Auth from "./auth.js";

passport.use(new GoogleStrategy({
    clientID: `client_id`,
    clientSecret: `clientsecret`,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("User Google Login Profile:", profile);
    try{
        let user = await users.findOne({ email: profile._json.email });

        if(!user) {
            const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
            const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
            const newPassword = lastSixDigitsID + lastTwoDigitsName;
            const hashedPassword = await Auth.hashPassword(newPassword);

            user = await users.create({
                // employeeDetails: {
                //     fullName: profile._json.name,
                // },
                email: profile._json.email,
                password: hashedPassword, 
                userName: profile._json.email           
            })
        }
        console.log("user",user);
        const token = await Auth.createToken({
            id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role,
            status: user.status
        });
        return done(null, { user, token });

    } catch (error) {
        return done(error)
    }
  }
));
