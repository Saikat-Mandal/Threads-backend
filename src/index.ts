import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import createApolloGraphqlServer from './graphql';


async function init() {
    const app = express()

    app.use(express.json())



    app.get("/", (req, res) => {
        res.json("hello from graphql")
    })

    const server = await createApolloGraphqlServer()

    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => console.log("port started on 4000"));

}

init()



