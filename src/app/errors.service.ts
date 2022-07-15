import { onError } from "@apollo/client/link/error";
import { ApolloLink } from '@apollo/client/core';
import { HttpLinkHandler } from 'apollo-angular/http';

// Variables
declare var M: any;

// Methods
const notifyGraphqlError = (graphQLError: any) => {
  console.error("graphQLError ELIMINAR:: ", graphQLError);
  graphQLError.map((data: any)=> {

  });
}

const notifyNetworkError = (networkError: any) => {

}

// Handler Error
export const linked = (http: HttpLinkHandler): ApolloLink => {
  return onError(({graphQLErrors, networkError, operation, response}) => {
    if(graphQLErrors) notifyGraphqlError(graphQLErrors);
    if(networkError) notifyNetworkError(networkError);
  }).concat(http);
}
