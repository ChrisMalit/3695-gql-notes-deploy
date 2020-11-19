const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:P@ssw0rd@cluster0.zo5ak.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var mongooseConnect = mongoose.connection;

const Note = mongoose.model("Note", {
    title: String,
    date: String,
    url: String,
    content: String,
    video: String,
    reminder: String,
    Image: String
});

const Upcoming = mongoose.model("Upcoming", {
    title: String,
    date: String,
    url: String,
    content: String,
    video: String,
    reminder: String,
    Image: String
});

const typeDefs = gql
`type Query {
    getNote(id: ID!): Note
    getNotes: [Note]
    getNoteByTitle(title: String!): [Note]
    getUpcoming: [Upcoming]
  }
  enum VideoCategory {
    LIVE_RECORD
    YOUTUBE
    DEVICE
  }
  type Note {
    id:ID!
    title: String!
    date: String!
    url: String!
    content: String!
    video: VideoCategory!
    reminder: String!
    Image: String
  }
  type Upcoming {
    id:ID!
    title: String!
    date: String!
    url: String!
    content: String!
    video: VideoCategory!
    reminder: String!
    Image: String
  }
  type Mutation {
      addNote(title: String!, date: String!, url: String!, content: String!, video:VideoCategory!, reminder:String!, Image:String): Note!,
      deleteNote(id: ID!): String,
      addImage(id: ID!, Image: String!): String
  }
`;

// Resolvers
const resolvers = {
    Query: {
        getNotes: () => Note.find(),
        getUpcoming: () => Upcoming.find(),
        getNote: async (_, { id }) => {
            var result = await Note.findById(id);
            return result;
        },
        getNoteByTitle: async (_, { title }) => {
            allNotes = await Note.find();
            var notes = allNotes.filter(b => b.title == title);
            return notes;
        }
    },

    Mutation: {
        addNote: async (_, { title, date, url, content, video, reminder, Image }) => {
            const note = new Note({ title, date, url, content, video, reminder, Image });
            await note.save();
            const imagePath = Image;
            if (imagePath !== null) {
                cloudinary.uploader.upload(imagePath, { tags: 'note taking app', public_id: title + Image });
            };
            return note;
        },
        deleteNote: async (_, { id }) => {
            await Note.findByIdAndRemove(id);
            return "Note deleted";
        },
        addImage: async (_, { id, Image }) => {
            await Note.findByIdAndUpdate(id, { Image: Image });
            cloudinary.uploader.upload(Image, { tags: 'note taking app', public_id: id + Image });
            return "Added Image";
        }
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