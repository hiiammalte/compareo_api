import { registerEnumType } from "type-graphql";

enum ComparisionType {
    NUMBER,
    TEXT,
    BOOLEAN
}

registerEnumType(ComparisionType, {
  name: "ComparisionType",
  description: "This is mandatory to tell the app on how to compare properties of two or more products"
});

export default ComparisionType;