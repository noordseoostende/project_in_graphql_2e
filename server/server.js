const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/schema');
const { Query } = require('./graphql/resolvers/query');
const { Mutation } = require('./graphql/resolvers/mutation');
const { User } = require('./graphql/resolvers/user');
const { Post } = require('./graphql/resolvers/post');
const { Category } = require('./graphql/resolvers/category');

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers:{
      Query,
      Mutation,
      User,
      Post,
      Category
    },
    context:({ req})=>{
      // req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDI5MzI4NGIxY2E5MDFkZDc3YmFjYWYiLCJlbWFpbCI6ImhpbW1pbnNAZ21haWwuY29tIiwiaWF0IjoxNjEzMzg2NDEyLCJleHAiOjE2MTM5OTEyMTJ9.FsirJ4eFAr8Wz7YH7CgYHXwrmmKK19EKQw8Z-7lYLDc';

      //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDI5MzI4NGIxY2E5MDFkZDc3YmFjYWYiLCJlbWFpbCI6Imhpa2tpbnNAZ21haWwuY29tIiwiaWF0IjoxNjEzMzEyNjQ0LCJleHAiOjE2MTM5MTc0NDR9.2DjwDqIXkzZgvQMDo8xNBUgfJpJDIvw8DUyazSf1KlA
      return {req}
    }

})
server.applyMiddleware({ app });
const PORT = process.env.PORT || 5000;

//mongodb+srv://higgins:<password>@cluster0.ctd92.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect(`mongodb+srv://graphqluser:testing123@cluster0.ctd92.mongodb.net/<dbname>?retryWrites=true&w=majority`,{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`de server start op port ${PORT}`);
  })

}).catch( err => {
  console.log(err)
})
