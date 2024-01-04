import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './users/index';
async function createApolloGraphqlServer() {
    // graphql server
    const server = new ApolloServer({
        typeDefs: `
        type Query {
            hello : String!
        }
        type Mutation {
           ${User.mutations}
        }
    `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    })
    // listening to server 
    await server.start();
    return server
}

export default createApolloGraphqlServer