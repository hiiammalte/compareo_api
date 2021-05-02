import { resolvers } from "./resolvers/index";
import { buildSchema } from 'type-graphql';
import AuthenticationChecker from "./middleware/authChecker";
import ErrorInterceptor from "./middleware/errorInterceptor";
import AccessLogger from "./middleware/accessLogger";

export const createSchema = async () => {
    const schema = await buildSchema({
        resolvers,
        emitSchemaFile: true,
        validate: false,
        authChecker: AuthenticationChecker,
        globalMiddlewares: [AccessLogger, ErrorInterceptor]
      });
      return schema;
}