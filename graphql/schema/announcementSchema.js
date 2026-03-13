import gql from "graphql-tag";

const announcementTypeDefs = gql`

  type TVMonitors {
    value: String,
    type: ValueTypes,
    mute: Boolean
  }

  type Announce {
    _id: ID
    department: Department
    main: TVMonitors
    side: TVMonitors
  }

  type Query {
    getMonitorValues:[Announce]
    findAnnouncement:Announce
    getAllAnnouncement: [Announce]
  }

  enum ValueTypes {
    text
    images
    video
  }

  input InputAnnouncement {
    value: String!
    type: ValueTypes!
    _id: ID
    side: Boolean!
  }

  type Mutation {
    createNewAnnounce(input: InputAnnouncement): Success
    updateAnnounce(input: InputAnnouncement): Success
  }
`;

export default announcementTypeDefs;
