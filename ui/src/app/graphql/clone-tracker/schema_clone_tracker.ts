

export const schema_clone_tracker = `

  input CloneIn {
    parent_dna_hash: String!,
    properties: String! 
    cloned_dna_hash: String!
  }

  type Clone {
    parent_dna_hash: String!,
    properties: String!
    cloned_dna_hash: String!
  }

  extend type Query {
    allClones(template_dna: String!): [Clone!]!
  }

  extend type Mutation {
    registerClone(clone: CloneIn!): ID!
  }
`;