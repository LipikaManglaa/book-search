const typeDefs = `
type Query {
  me: User
}

type User {
  _id: ID
  username: String
  email: String
  password: String
  bookCount: Int
  savedBooks: [Book]
}



input saveBookInput {
  description: String
  title: String
  bookId: String
  image: String
  link: String
  authors: [String]
}

type Book {
  _id: ID
  authors: [String]
  description: String
  bookId: String
  image: String
  link: String
  title: String
 }

type Auth {
  token: ID!
  user: User
}
type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, password: String!, email: String!): Auth
  saveBook(body: saveBookInput): User
  removeBook(bookId: String!): User
}

  
`;

module.exports = typeDefs;
