const { User } = require('../../models/user');
const { UserInputError, AuthenticationError, ApolloError } = require('apollo-server-express');

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
  }
}