import { buildSchema } from "graphql";

const characterSchema = buildSchema(`

    type Post {
        _id: ID!
        title: String!
        imgUrl: String!
        content: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id : ID!
        email: String!
        name: String!
        password: String
        posts : [Post!]!
    }    

    input userInputData {
        email: String!
        name: String!
        password: String!
    }

    type Mutation{
        signup(userInput: userInputData): User!
    }
    
    type hello {
        text: String!
        views: Int!
    }

    schema{
        query: hello
        mutation: Mutation
    }
`);

export {characterSchema};