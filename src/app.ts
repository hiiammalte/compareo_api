import "reflect-metadata";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import connectToDB from "./db/index"
import { port, clientUrl } from "./config/environment/index"
import { runApolloServer } from "./graphql";
import { tokenValidationMiddleware } from "./authentication/validationMiddleware";
import { validateRefreshToken } from "./authentication/validateTokens";
import { UserModel } from "./entities/User";
import { setAccessToken } from "./authentication/setTokens";

const start = async () => {
  
  console.log('Connecting to database');
  await connectToDB();
  console.log('Connected to database');

  const app = express();
  
  app.use(
    cors({
      origin: `${clientUrl}`,
      credentials: true
    }),
    cookieParser(),
    tokenValidationMiddleware,
    express.urlencoded({ extended: true }),
  );

  app.get("/refreshAccess", async (req, res) => {
    // reading refresh-token from cookie
    const token = req.cookies["compareo"] as string;
    if (!token) {
      return res.send({
        ok: false,
        errors: [{ message: "Refresh token not found" }]
      })
    }

    // validating refresh-token
    const decodedToken = validateRefreshToken(token);
    if (!decodedToken) {
      return res.send({
        ok: false,
        errors: [{ message: "Invalid refresh token" }]
      })
    }

    // validating user and if access has not been revoked
    const user = await UserModel.findById({_id: decodedToken!.userId});
    if (!user || user.tokenCount !== decodedToken!.tokenVersion) {
      return res.send({
        ok: false,
        errors: [{ message: "Invalid refresh token" }]
      })
    }
        
    // creating new access-token
    const { accessToken } = setAccessToken(user!);
    return res.send({
      ok: true,
      token: accessToken!
    });
  })

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
  console.log('Unable to run Apollo server');
  console.log(error);
});