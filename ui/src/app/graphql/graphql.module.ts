import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { makeExecutableSchema } from 'graphql-tools'
import { ApolloLink } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import {InMemoryCache} from 'apollo-cache-inmemory';

import { HolochainService } from '../core/holochain.service'
import { schema_profile } from './profile/schema_profile';
import { schema_transactor } from './transactor/schema_transactor';
import { schema_clone_tracker } from './clone-tracker/schema_clone_tracker';
import {resolvers_profile} from './profile/resolvers_profile';
import {resolvers_transactor} from './transactor/resolvers_transactor';
import {resolvers_clone_tracker} from './clone-tracker/resolvers_clone_tracker';


export function createApollo(hcs:HolochainService) {
  //console.log("in graph module with connection:",hcs.hcConnection)
  const HService = hcs
  const schemas = [schema_profile,schema_transactor,schema_clone_tracker]
  const resolverlist = [resolvers_profile,resolvers_transactor,resolvers_clone_tracker]
  const schemaLink = new SchemaLink({ schema: makeExecutableSchema({typeDefs:schemas, resolvers:resolverlist}), context: HService })
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