
//import gql from 'graphql-tag';

export const schema_profile = `
  type Agent {
    id: ID!
    username: String
  }
  type Me {
    id: ID!
    agent: Agent!
  }
  type Query {
    allAgents: [Agent!]!
    me: Me!
  }
  type Mutation {
    setUsername(username: String!): Agent!
    deleteUsername(name:String!): Boolean!
  }
`;