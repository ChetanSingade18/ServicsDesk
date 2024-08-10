import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import users from "../models/user.js";
import Auth from "./auth.js";

passport.use(new GoogleStrategy({
    clientID: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
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
                employeeDetails: {
                    fullName: profile._json.name,
                },
                email: profile._json.email,
                password: hashedPassword,            
            })
        }

        const token = await Auth.createToken(user);
        return done(null, { user, token });

    } catch (error) {
        return done(error)
    }
  }
));
