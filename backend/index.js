import 'dotenv/config';
import express from 'express';

import { connectDB } from './db/connectDB.js';

import http from 'http';
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;
// 1. Define your GraphQL schema (same as TS)
// const typeDefs = `#graphql
//   type Book {
//     title: String
//     author: String
//   }

//   type Query {
//     books: [Book]
//   }
// `;

// 2. Define your data
// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin",
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster",
//   },
// ];

// 3. Define resolvers
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };

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
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({req}),
  }),
);

// Start HTTP Server
await new Promise((resolve) =>
  httpServer.listen({ port: PORT }, resolve)
);

await connectDB();

console.log(`🚀 Server ready at http://localhost:${PORT}/`);