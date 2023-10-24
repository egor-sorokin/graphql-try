import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// import WeatherAPI from './api/weather.js';
// import { resolvers } from './resolvers.js';
import { readFileSync } from 'fs';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

let books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
];

// Define resolvers for your GraphQL schema
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, { id }) => books.find(book => book.id === id),
  },
  Mutation: {
    addBook: (parent, { title, author }) => {
      const newBook = { id: String(books.length + 1), title, author };
      books.push(newBook);
      return newBook;
    },
    updateBook: (parent, { id, title, author }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }
      if (title) books[bookIndex].title = title;
      if (author) books[bookIndex].author = author;
      return books[bookIndex];
    },
    deleteBook: (parent, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }
      const [deletedBook] = books.splice(bookIndex, 1);
      return deletedBook;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);


// interface ContextValue {
//   dataSources: {
//     weatherAPI: WeatherAPI;
//   };
// }

// const server = new ApolloServer<ContextValue>({
//   typeDefs,
//   resolvers,
// });

// const { url } = await startStandaloneServer(server, {
//   context: async () => {
//     const { cache } = server;
//     return {
//       dataSources: {
//         weatherAPI: new WeatherAPI({ cache }),
//       },
//     };
//   },
// });

console.log(`🚀  Server ready at: ${url}`);
