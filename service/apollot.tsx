import {
    ApolloClient,
    createHttpLink,
    from,
    InMemoryCache,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import { useRef } from "react";
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                countVisitsDash: {
                    merge: true,
                },
                countPromoterDash: {
                    merge: true,
                },
                countPdvDash: {
                    merge: true,
                },
                countTasksDash: {
                    merge: true,
                },
                listPromoters: {
                    merge: true,
                },
                visitsPromoters: {
                    merge: true,
                },
            },
        },
    },
    // Configurações de performance do cache
    resultCaching: true,
    canonizeResults: true,
    // Configurações de memória
    possibleTypes: {},
    // Configurações de persistência
    addTypename: true,
    // Configurações de performance
    dataIdFromObject: (object) => {
        if (object.__typename && object.id) {
            return `${object.__typename}:${object.id}`;
        }
        return null;
    },
});
const persistor = new CachePersistor({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
});

export const useInitializeClient = () => {
    const clientRef = useRef<ApolloClient<any> | undefined>(undefined);

    if (!clientRef.current) {
        const httpLink = createHttpLink({ uri: 'https://team-mobile-api.rock-at.com/graphql' });
        //const httpLink = createHttpLink({ uri: 'https://team-mobile-api.rock-at.com/graphql' });

        const authLink = setContext(async (_, { headers }) => {
            // get the authentication token from local storage if it exists
            // return the headers to the context so httpLink can read them
            const currentToken = await AsyncStorage.getItem('auth_token_2');

            return {
                headers: {
                    ...headers,
                    Authorization: currentToken ?? "",
                }
            }
        });

        clientRef.current = new ApolloClient({
            link: authLink.concat(httpLink),
            cache,
            credentials: "include",
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: "cache-and-network",
                    errorPolicy: "ignore",
                    notifyOnNetworkStatusChange: false,
                    // Configurações de performance
                    pollInterval: 0,
                },
                query: {
                    fetchPolicy: "cache-first",
                    errorPolicy: "ignore",
                    notifyOnNetworkStatusChange: false,
                },
                mutate: {
                    errorPolicy: "ignore",
                },
            },
            // Configurações para melhorar performance
            connectToDevTools: false,
            assumeImmutableResults: true,
            // Configurações de performance adicionais
            queryDeduplication: true,
            defaultContext: {
                // Configurações de timeout
                timeout: 30000,
            },
        });
        clientRef.current.onClearStore(async () => {
            await persistor.purge();
        });
    } else {
    }

    return clientRef.current;
};
