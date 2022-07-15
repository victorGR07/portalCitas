import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {APOLLO_NAMED_OPTIONS, NamedOptions} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';

// Services
import { linked } from './errors.service';

// Variables
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      // Tramite


      useFactory(httpLink: HttpLink): NamedOptions {
        const httpAuth = httpLink.create({uri: environment.URIBackProveedores});
        const linkAuth = linked(httpAuth);
        return {
          ['backproveedores']: {
            link: linkAuth,
            cache: new InMemoryCache(),
            defaultOptions: {
              query: {
                fetchPolicy: 'no-cache'
              }
            }
          },


        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
  constructor(){

  }
}
