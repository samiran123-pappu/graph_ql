

import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
const userResolver = {
    Mutation:{
        signUp: async(_, {input}, context) => {
            try {
                const {username, name, password, gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }
                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("Username already taken");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
                })
                await newUser.save();
                await context.login(newUser);
                return newUser;
                
            } catch (error) {
                console.error("Signup error:", error);
                throw new Error("Error during sign up: " + error.message);
                
            }
        },
        login: async(_, {input}, context) => {
            try {
                const {username, password} = input;
                await context.authenticate('graphql-local', {username, password});

                await context.login(user);
                return user;
            } catch (error) {
                console.error("Login error:", error);
                throw new Error("error during login" + error.message);
            }
        },
        logout: async(_, __, context) => {
            try {
                await context.logout();
                req.session.destroy(
                    (error) => {
                        if(error){
                            throw new Error("Error during logout" + error.message);
                        }
                    }
                )
                res.clearCookie('connect.sid');
                return {
                    success: true,
                    message: "Logged out successfully",
                }
            } catch (error) {
                console.error("Logout error:", error);
                throw new Error("Error during logout" + error.message);
                
            }
        }
        
    },
    Query:{
        authUser: async(_, __, context) => {
            try {
                const user = context.getUser();
                return user;
                
            } catch (error) {
                console.error("AuthUser error:", error);
                throw new Error("Error during authUser" + error.message);
                
            }

        },
        user: async(_, {userId}) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.error("User error:", error);
                throw new Error( error.message || "Error during user" );
            }
        }
    },
    // TODO => add the transactions field resolver

};


export default userResolver