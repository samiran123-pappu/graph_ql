import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { connectDB } from './db/connectDB.js';

import http from 'http';
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { buildContext } from "graphql-passport";
import passport from 'passport';
import session from "express-session";
import connectMongo from "connect-mongodb-session"

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import { configurePassport} from "./passport/passport.config.js";

// Configure Passport
await configurePassport();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


const PORT = process.env.PORT || 4000;
const httpServer = http.createServer(app);
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collections: "sessions",
})

store.on("error", (err) => console.log("SESSION STORE ERROR", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this defies whether to save the session back to the store even if it was never modified on every request
    saveUninitialized: false, //don't create session until something is stored
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
      httpOnly: true, //xss protection
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());



// 4. Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers:mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start Apollo Server
await server.start();



// Express middleware setup
app.use(
  '/graphql',
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req,res }) => buildContext({ req, res }),
  }),
);

// Connect to MongoDB first before starting the server
await connectDB();

// Start HTTP Server
await new Promise((resolve) =>
  httpServer.listen({ port: PORT }, resolve)
);

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);