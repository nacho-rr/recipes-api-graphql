import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import jwt from 'jsonwebtoken';

import { UserResolver } from './resolver/UserResolver';
import { RecipeResolver } from './resolver/RecipeResolver';
import { CategoryResolver } from './resolver/CategoryResolver';

export async function startServer() {
  const app = express();
  
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, RecipeResolver, CategoryResolver],
      validate: false
    }),
    context: ({ req, res }) => {
      const token = req.headers['authorization'] || '';
      if(token){
        try {
          const user = jwt.verify(token, 'secret');
          return user 
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
  
  server.applyMiddleware({ app, path: '/graphql' });
  
  return app;
}