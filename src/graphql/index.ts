import { ApolloServer } from 'apollo-server-express';
import { IAccessTokenPayload } from '../authentication/tokenDefs';
import { env } from '../config/environment';
import { createSchema } from "./schema";

export const runApolloServer = async () => {
    return new ApolloServer({
        schema: await createSchema(),
        context: ({ req, res }) => {
            const context = {
              req,
              res,
              user: req.user as IAccessTokenPayload,
            };
            return context;
        },
        playground: env.isDevelopment,
    });
}