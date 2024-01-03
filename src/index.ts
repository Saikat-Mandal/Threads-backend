import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors"
import express from 'express';
import { prismaClient } from './lib/db';


async function init() {
    const app = express()

    app.use(express.json())

    // graphql server
    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello : String
                say(name : String) : String
            }
            type Mutation {
                createUser(firstname : String! , lastname : String! , email : String!  , password : String!) : Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello i am a graphql server",
                say: (_, { name }: { name: String }) => `hello ${name} nigga`
            },
            Mutation: {
                createUser: async (_,
                    { firstname, lastname, email, password }:
                        { firstname: string, lastname: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            firstname,
                            lastname,
                            email,
                            password,
                            salt: 'ramdom_salt'
                        }
                    })
                    return true
                }
            }
        }
    })

    app.get("/", (req, res) => {
        res.json("hello from graphql")
    })


    // listening to server 
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => console.log("port started on 4000"));

}

init()



