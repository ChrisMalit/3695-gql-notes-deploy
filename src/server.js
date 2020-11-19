const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const mongoose = require('mongoose');
const cron = require('node-cron').ApolloServer;
const moment = require('moment').ApolloServer;
var cloudinary = require('cloudinary').v2;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hi! Love from @stemmlerjs 🤠."
  }
};
function createLambdaServer () {
    return new ApolloServerLambda({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
    });
}
  
  function createLocalServer () {
    return new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
    });
}
  
module.exports = { createLambdaServer, createLocalServer }