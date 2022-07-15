import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule , HttpLink} from 'apollo-angular-link-http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import {StorageService} from "../core/services/storage.service";

import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { split, from } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';

import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { SubscriptionService } from '../core/subscription.service';
import { WebSocketLink } from 'apollo-link-ws';
import { errorLink, uploadLink, createAuthLink } from '../graphql/middlewares';
import introspectionQueryResultData from '../../assets/fragmentTypes.json';
import { AccountService } from '../auth/autentication.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [ApolloModule, HttpLinkModule],
  providers: []
})
export class GraphqlModule {


  constructor(
    apollo: Apollo,
    authService: AuthService,
    subscriptionService: SubscriptionService,
    httpLink: HttpLink,
    private storageService: StorageService,
    private accountService: AccountService


  ) {
    const WS_URI = `wss://${environment.HOST}:${environment.PORT}${
      environment.WS_PATH
    }`;

    let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiVTJGc2RHVmtYMTlhRVZ1L1IwR3J3WWNVSmp6V29mazRxS0JmaHVEQTRqYTlmbUlNSXZXay91Qk9tNGRDVmhhSUF3UzVXbnpnc0hvcGloRklLcGc2WFNxb25ZUHFLejBTeVdpT2lhOVl5TWhhUGpaTlk2ZjgzYWhucnpZVnhrMjh6T3EyVHlXeUhMRzlKd3FHa2lEa2RHdVRYQktlV2IxdmtZOXNQdjV6cVh0UTdQSE1YQ3U5bmE3bHM4dFJGdHorcCs2Kzd2aVVJdy96YkpuNEF1K0grL2ZSbjBqa3ZOY1hUdFh0ano4Nmk2VTNETUZGOUdUR3R0eS9xaHJaOFlkWHY4eW9UbkNOWnkwUHFCcGFNYnNXSm5iWms4ajRxR1RsdFBKU281b2taYkcvUW5FUWdFM2JHcjh4R3YrR1ZXdjNoK3VCWjhtR0I2SVdDSDU1YUxOVlBiblpLS1J1Tld1RmhBcmRINHNMSk12WHljN0I0SHRxTEFTbUhHaWhIbkRUSUpqOWpIUENjTE1iQjlpS0tja2ozRkhueWlRc1NTdUt3VGs1SHBjMHhod0dlVXNTcTdvVzVGaFFsbTlHZVpKUkdUbUpyV2lFN3lLa2t2b2I5UXM3bWV3T0ZBRW1lN0haRXl4dGlxc2RidnE4OE9HMVVjenV2cTl0VTVLS2dIYk9qQkhVMFJNV1dMdHF2OG5TTlV5WTdMUndHK2puUjNIWmkxUjdKbkhCYTdCeDRMT2FUWTFSaGJpUWN2VTZoY2N4Z24xWGg1aEYxendtVGNqUjljZmplR2I3OGNibzJHRmRpQW9kcGNtWDN6bz0iLCJpYXQiOjE2MTcyMjg0MTd9.pOnjat-jO3VfAFAtz-4By5YSz9bjNsMBlhDPpGS_bNg';
    let tokenservicios2 = ''
    if(this.accountService.getTokensAccount!=undefined){
    tokenservicios2 = `Bearer ${this.accountService.getTokensAccount.X_TOKEN_ACCOUNT }`
    }


    const wsClient = subscriptionService.getWSClient(WS_URI, {
      lazy: true,
      // When connectionParams is a function, it gets evaluated before each connection.
      connectionParams: () => {
        return {
          authorization: tokenservicios2,
        };
      },
      reconnect: true,
      reconnectionAttempts: 5,
      connectionCallback: (error: Error[]) => {
        if (error) {
        }
      },
      inactivityTimeout: 1000
    });

    const wsLink = new WebSocketLink(wsClient);

    const networkLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(
          query
        ) as OperationDefinitionNode;
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      uploadLink
    );

    const authLink = createAuthLink(authService,this.accountService);
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });

    apollo.create({
      link: from([authLink, errorLink, networkLink]),
      cache: new InMemoryCache({ fragmentMatcher })
    });

    const options2: any = { uri: environment.URIServicios };
    apollo.createNamed('endpoint2', {
      link: httpLink.create(options2),
      cache: new InMemoryCache()
    });
    const options3: any = { uri: environment.URIImpresiones,headers: new HttpHeaders({
                 authorization: tokenservicios2   }) };
    apollo.createNamed('endpointimpresiones', {
      link: httpLink.create(options3),
      cache: new InMemoryCache()
    });

    const options4: any = { uri: environment.URIConsultas,headers: new HttpHeaders({
                 authorization: tokenservicios2   }) };
    apollo.createNamed('consultas', {
      link: httpLink.create(options4),
      cache: new InMemoryCache()
    });


    const options5: any = { uri: environment.URITramites,headers: new HttpHeaders({
                 authorization: tokenservicios2   }) };
    apollo.createNamed('tramites', {
      link: httpLink.create(options5),
      cache: new InMemoryCache()
    });


    const options7: any = { uri: environment.URLDocumentos};
    apollo.createNamed('documentos', {
      link: httpLink.create(options7),
      cache: new InMemoryCache()
    });


  }
}
