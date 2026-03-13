import gql from "graphql-tag";

const branchTypeDefs = gql`
  type Query {
    getBranches: [Branch]
  }

  input InputBranch {
    name: String!
    _id: ID
  }

  type Mutation {
    createNewBranch(name: String): Success
    updateBranch(input: InputBranch): Success
    deleteBranch(id: ID!): Success
  }
`;

export default branchTypeDefs;
