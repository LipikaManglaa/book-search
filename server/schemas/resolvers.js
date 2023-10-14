const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
 
  Query: {
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
 me: async (parent, args, context) => {
   if (context.user) {
     return Profile.findOne({ _id: context.user._id }).select(
      "-__v -password"
     );
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

   const correctPw = await User.isCorrectPassword(password);

   if (!correctPw) {
     throw AuthenticationError;
   }

   const token = signToken(user);
   return { token, user };
 },


 addUser: async (parent, args) => {
  const user = await User.create(args);
  const token = signToken(user);
  return { token, user };
},
    saveBook: async (parent, { body },context) => {
     if(context.user){
          return User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: body } },
        { new: true }
      );
     }

      throw AuthenticationError;
    },
  
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { bookId: bookId } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;