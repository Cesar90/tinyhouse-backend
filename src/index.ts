require('dotenv').config()

import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

// import {schema} from './graphql'
// import bodyParser from 'body-parser'
// import { listings } from './listings'

// const port = 9000
const app = express();
const mount = async(app: Application) => {
  const db = await connectDatabase()
  // options for cors middleware
  const options: cors.CorsOptions = {
    origin: [
      "https://cesar-tinyhouse.netlify.app",
      "https://main--cesar-tinyhouse.netlify.app",
      "http://localhost:3000"],
  };
  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cors(options));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());
  const server = new ApolloServer({
    typeDefs, resolvers, context: () => ({ db }), playground: true,
  introspection: true, });
  // server.applyMiddleware({ app, path: '/api' })
  server.applyMiddleware({
    cors: {
      origin: [
        "https://cesar-tinyhouse.netlify.app",
        "https://main--cesar-tinyhouse.netlify.app",
        "http://localhost:3000"],
      credentials: true,
    },
    app, path: '/api' 
  })
  app.listen(process.env.PORT)
  console.log(`[app]:http://localhost:${process.env.PORT}`)

  // const listings = await db.listings.find({}).toArray()
  // console.log(listings)
}

mount(app)
export default app;

// const server = new ApolloServer({ typeDefs: ``, resolvers: {} });
//const server = new ApolloServer({schema});
// const server = new ApolloServer({typeDefs, resolvers})
// server.applyMiddleware({ app, path: '/api' })

// app.use(bodyParser.json());

// app.get('/listings', (_req, res) => {
//   return res.send(listings)
// })

// app.post('/delete-listing',(req, res) => {
//   const id: string = req.body.id

//   for(let i = 0; i < listings.length; i++){
//     if(listings[i].id === id){
//       return res.send(listings.splice(i, 1))
//     }
//   }

//   return res.send('failed to delete listing')
// })

// app.listen(port)

// console.log(`[app]:http://localhost:${port}`)

