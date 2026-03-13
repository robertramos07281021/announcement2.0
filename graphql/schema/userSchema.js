import gql from "graphql-tag";

const UserTypeDefs = gql`
  type Query {
    findUsers: [User]
    findMe: User
  }

  enum Types {
    ADMIN
    USER
  }

  input InputCreatingAccount {
    username: String!
    department: ID!
    name: String!
    type: Types!
  }
  
  type Mutation {
    createAccount(input: InputCreatingAccount): Success
    updateAccount(input:InputCreatingAccount,id: ID!): Success
    login(username:String!, password:String!): Success
    logout:Success
    onTvNavigate(value: Boolean):Success
    deleteAccount(_id:ID!): Success
  
  }
`;

export default UserTypeDefs;
