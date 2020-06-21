import { createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', { reconnect: true });

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [devtoolsExchange, ...defaultExchanges, subscriptionExchange({
      forwardSubscription(operation) {
      	return subscriptionClient.request(operation);
      }
    })],
});

export default client
