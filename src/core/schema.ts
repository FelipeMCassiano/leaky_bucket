import { buildSchema } from "graphql";

export const schema = buildSchema(`
type Query {
    _empty: String
}
type Mutation {
    pix(input: PixInput!): PixResponse!
}

input PixInput {
    key: String!,
    value: Int!
}


type PixResponse {
    status: String!
    remainingTokens: Int!
}
`);
