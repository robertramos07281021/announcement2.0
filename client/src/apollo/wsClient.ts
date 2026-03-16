import { createClient } from 'graphql-ws';
import { store } from '../redux/store';

let wsClient: ReturnType<typeof createClient> | null = null;

export function getWsClient() {
  if (!wsClient) {
    const hostname = "announcement2-0.onrender.com";
    wsClient = createClient({
      url: `wss://${hostname}/graphql`,
      connectionParams: () => {
        const token = store.getState().auth.userLogged?.token;
       
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
      lazy: true,
      retryAttempts: 3,
    });
  }
  return wsClient;
}

export function closeWsClient() {
  if (wsClient) {
    wsClient.dispose();
    wsClient = null;
  }

}

