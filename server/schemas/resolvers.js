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
console.log(user)
   if (!user) {
     throw AuthenticationError;
   }

   const correctPw = await user.isCorrectPassword(password);
console.log(correctPw)
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
        { $addToSet: { savedBooks:input } },
        { new: true }
      );
      console.log(updatedUser)
      return updatedUser;
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
