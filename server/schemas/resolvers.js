const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
 
  Query: {
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
 me: async (parent, args, context) => {
  
   if (context.user) {
    const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
       return userData;
    
   }
   throw AuthenticationError;
 },
},

Mutation: {
 
 login: async (parent, { email, password }) => {
   const user = await User.findOne({ email });

   if (!user) {
     throw AuthenticationError;
   }

   const correctPw = await user.isCorrectPassword(password);

   if (!correctPw) {
     throw AuthenticationError;
   }

   const token = signToken(user);
   console.log(token)
   return { token, user };
 },


 addUser: async (parent, args) => {
  const user = await User.create(args);

  const token = signToken(user);
  return { token, user };
},
    saveBook: async (parent, { input },context) => {
     if(context.user){
      const updatedUser =await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: input } },
        { new: true }
      );
      
      return updatedUser;
     }

      throw AuthenticationError;
    },
    removeBook: async (_parent, { bookId }, context) => {
    
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please login or register");
    },
  },
};

    
   

  

module.exports = resolvers;
