import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`);

      // Handle authentication errors
      if (message.includes("Unauthorized") || message.includes("invalid token")) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Handle validation errors
      if (message.includes("validation") || message.includes("required")) {
        console.warn(`[Validation Error]: ${message}`);
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    if (networkError.statusCode === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
});

// HTTP connection
const httpLink = createHttpLink({
  uri: 'http://localhost:8081/graphql', // User service endpoint
  credentials: 'include', // Enable sending cookies if needed
});

// Auth middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    mutate: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default client;