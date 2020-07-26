import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { makeExecutableSchema } from 'graphql-tools'
import { ApolloLink } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import {InMemoryCache} from 'apollo-cache-inmemory';

import { HolochainService } from '../core/holochain.service'
import { schema_profile } from './schema_profile';
import { schema_transactor } from './schema_transactor';
import {resolvers_profile} from './resolvers_profile';
import {resolvers_transactor} from './resolvers_transactor';


export function createApollo(hcs:HolochainService) {
  console.log("in graph module with connection:",hcs.hcConnection)
  const callZome = hcs.hcConnection
  const schemas = [schema_profile,schema_transactor]
  const resolverlist = [resolvers_profile,resolvers_transactor]
  const schemaLink = new SchemaLink({ schema: makeExecutableSchema({typeDefs:schemas, resolvers:resolverlist}), context: callZome })
  const links =[schemaLink] 

  return {
    link: ApolloLink.from(links),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        }
      }
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HolochainService]
    },
  ],
})
export class GraphQLModule {}