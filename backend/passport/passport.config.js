import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";


export const configurePassport = async () => {
    passport.serializeUser((user, done)=>{
        console.log("SERIALIZE USER");
        done(null, user.id);
    });
    passport.deserializeUser(async(id, done) => {
        console.log("DESERIALIZE USER");
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
    passport.use(
        new GraphQLLocalStrategy(async(username, password, done) => {
            console.log("GRAPHQL LOCAL STRATEGY");
            try {
                const user = await User.findOne({username});
                if(!user){
                    return done(null,false, {message: "Incorrect username or password"});
                }
                const isValidPassword = await bcrypt.compare(password, user.password);
                if(!isValidPassword){
                    return done(null,false, {message: "Incorrect username or password"});
                }

                return done(null, user);
                
            } catch (error) {
                return done(error);
                
            }

        })
    )
}