import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors"
import express from 'express';


async function init() {
    const app = express()

    app.use(express.json())
    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello : String
                say(name : String) : String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello i am a graphql server",
                say: (_, { name }: { name: String }) => `hello ${name} nigga`
            }
        }
    })

    app.get("/", (req, res) => {
        res.json("hello from graphql")
    })
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => console.log("port started on 4000"));

}
init()

