import pubsub from "../../middlewares/pubsub.js";
import { PUBSUB_EVENTS } from "../../middlewares/pubsubEvents.js";
import { withFilter } from "graphql-subscriptions";

const subscriptionsResolver = {
  Subscription: {
    accountOffline: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([PUBSUB_EVENTS.OFFLINE_USER]),
        (payload, variables, context) => {
          if (variables.userId) {
            return payload.accountOffline.userId === variables.userId;
          }
          return false;
        },
      ),
    },
    newAccountCredential: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([PUBSUB_EVENTS.NEW_LOGIN]),
        (payload, variables, context) => {
          if (variables.userId) {
            return payload.newAccountCredential.userId === variables.userId;
          }
          return false;
        },
      ),
    },
    newAnnouncement: {
      subscribe: () => {
        return pubsub.asyncIterableIterator([PUBSUB_EVENTS.NEW_ANNOUNCEMENT]);
      },
    }
  },
};

export default subscriptionsResolver;
