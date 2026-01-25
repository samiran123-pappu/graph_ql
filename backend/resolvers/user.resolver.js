import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
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

                // DiceBear avatar URL - using different styles for boy/girl
                const boyProfilePic = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;
                const girlProfilePic = `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;
                // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?usearname==${username}`;
				// const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username==${username}`;

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
                if (!username || !password) {
                    throw new Error("Please fill in back fields");  
                }
                // if (!username || !password) return toast.error("Please fill in back  fields");

                const { user } = await context.authenticate('graphql-local', {username, password});
                await context.login(user);
                return user;
            } catch (error) {
                console.error("Login error:", error);
                throw new Error("Error during login: " + error.message);
            }
        },
        logout: async(_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy(
                    (error) => {
                        if(error){
                            throw new Error("Error during logout: " + error.message);
                        }
                    }
                )
                context.res.clearCookie('connect.sid');
                return {
                    success: true,
                    message: "Logged out successfully",
                }
            } catch (error) {
                console.error("Logout error:", error);
                throw new Error("Error during logout: " + error.message);
                
            }
        }
        
    },
    Query:{
        authUser: async(_, __, context) => {
            try {
                const user = context.getUser();
                // Return null if user is not authenticated (prevents crash)
                return user || null;
                
            } catch (error) {
                console.error("AuthUser error:", error);
                // Return null instead of throwing to prevent 500 errors
                return null;
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

    User: {
        transactions: async (parent) => {
            try{
                const transactions = await Transaction.find({userId: parent._id})
                return transactions;

            }catch(error){
                console.error("Transactions error:", error);
                throw new Error( error.message || "Error during transactions" );

            }

        }
    }

};


export default userResolver