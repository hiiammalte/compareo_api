import UserResolver from "./user";
import ProjectResolver from "./project"
import CategoryResolver from "./category";
import AttributeResolver from "./attribute";
import ProductResolver from "./product";
import CollaborationResolver from "./collaboration";

export const resolvers = [UserResolver, ProjectResolver, CategoryResolver, AttributeResolver, ProductResolver, CollaborationResolver] as const;