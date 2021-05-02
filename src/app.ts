import "reflect-metadata";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import connectToDB from "./db/index"
import { port } from "./config/environment/index"
import { runApolloServer } from "./graphql";
import { tokenValidationMiddleware } from "./authentication/validationMiddleware";

const start = async () => {
  
  console.log('Connecting to database');
  await connectToDB();
  console.log('Connected to database');

  const app = express();

  app.use(
    cors(),
    cookieParser(),
    tokenValidationMiddleware,
    express.urlencoded({ extended: true }),
  );

  const apolloServer = await runApolloServer();
  apolloServer.applyMiddleware({
    app,
    path: "/graphql",
    cors: false
  });

  app.listen(port, () => {
    console.log(`🚀 Apollo Server on http://localhost:${port}/graphql`);
  });
}

start().catch((error) => {
  console.log('Not able to run Apollo server');
  console.log(error);
 });