import gql from "graphql-tag";

const departmentTypeDefs = gql`
  type Query {
    getDepts: [Department]
  }

  input InputDepartment {
    name: String!
    branch: ID!
    _id: ID
  }
  
  type Mutation {
    createNewDepartment(input: InputDepartment): Success
    updateDepartment(input: InputDepartment): Success
    deleteDepartment(_id:ID!): Success
  }
`;

export default departmentTypeDefs;
