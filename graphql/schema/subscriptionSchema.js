import gql from "graphql-tag";

const subscriptionTypeDefs = gql`
  type Subscription {
    accountOffline(userId: ID):SubscriptionSuccess
    newAccountCredential(userId: ID): SubscriptionSuccess
    newAnnouncement:SubscriptionSuccess
  }
`

export default subscriptionTypeDefs