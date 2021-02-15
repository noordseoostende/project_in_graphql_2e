const { User } = require('../../models/user');
const { Post } = require('../../models/post');
const { UserInputError, AuthenticationError, ApolloError } = require('apollo-server-express');
const authorize = require('../../utils/isAuth');
const { userOwnership } = require('../../utils/tools');

module.exports = {
  Mutation:{
    authUser: async(parent,args,context,info)=>{
      try {
        const user = await User.findOne({
          'email': args.fields.email
        });
        if(!user) { throw new AuthenticationError('Email is niet correct');}
        const checkpass = await user.comparePassword(args.fields.password);
        if(!checkpass) {throw new AuthenticationError('Wachtwoord is niet correct');}
        const getToken = await user.generateToken();
        if(!getToken) {
          throw new AuthenticationError('Iets was niet correct');
        }

        return {
          _id:user._id,
          email:user.email,
          token: getToken.token
        };
      } catch (err) {
          
          throw err
      }
    },
    signUp: async(parent,args,context,info)=>{
      try {
        const user = new User({
          email: args.fields.email,
          password: args.fields.password
        });

        const getToken = await user.generateToken();
        if(!getToken) {
          throw new AuthenticationError('Iets was verkeerd gedaan, probeer het opnieuw');
        }
        return {...getToken._doc}
      } catch (err) {
          if(err.code === 11000){
            throw new AuthenticationError('Sorry, dat was gedupliceerde e-mail, probeer het opnieuw');
          }
          throw err
      }
    },
    updateUserProfile: async(parent,args,context,info)=>{
      try {
        const req = authorize(context.req);
        if(!userOwnership(req,args._id))
        throw new AuthenticationError("Je ben geen eigenaar van deze gebruiker")

        const user = await User.findByIdAndUpdate(
          {_id:args._id},
          {
            "$set":{
              name:args.name,
              lastname:args.lastname
            }
          },
          { new: true }
        );

        return {...user._doc}
      } catch (err) {
        throw err;
      }
    },
    updateUserEmailPass: async(parent,args,context,info)=>{
      try {
        const req = authorize(context.req);
        if(!userOwnership(req,args._id))
        throw new AuthenticationError("Je ben geen eigenaar van deze gebruiker");

        const user = await User.findOne({_id:req._id});
        if(!user) throw new AuthenticationError("Probeer het nog eens");

        if(args.email){ user.email = args.email }
        if(args.password){ user.password = args.password }

        const getToken = await user.generateToken();
        if(!getToken) {
          throw new AuthenticationError('Iets was niet correct');
        }

        return { ...getToken._doc, token:getToken.token}
        
      } catch (err) {
        throw new ApolloError('Iets was niet correct',err);
      }
    },
    createPost: async(parent,{ fields },context,info)=>{
      try {
        const req = authorize(context.req);

        const post = new Post({
          title: fields.title,
          excerpt: fields.excerpt,
          content: fields.content,
          author:req._id,
          status: fields.status

        });
        const result = await post.save();
        return { ...result._doc };
      } catch (err) {
        throw err
      }
    }
  }
}