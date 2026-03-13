import gql from "graphql-tag";

const typesTypeDefs = gql`
  type Success {
    success: Boolean
    message: String
    user: User
    announcement: ID
  }

  type Branch {
    _id: ID
    name: String
  }

  type Department {
    _id: ID
    name: String
    branch: Branch
  }

  type User {
    _id: ID
    username: String
    name: String
    department: Department
    token: String
    type: String
    onTv: Boolean
  }

  type SubscriptionSuccess {
    message: String
  }
`;
export default typesTypeDefs;
