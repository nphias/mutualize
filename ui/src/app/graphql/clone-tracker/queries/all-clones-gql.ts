import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

/*export interface Property {
  name:string,
  value:string
}*/

export interface Clone {
  parent_dna_hash: string,
  properties: string,
  cloned_dna_hash: string
}

export interface Response {
  allClones: Clone[]
}

@Injectable({
    providedIn: 'root',
  })
  export class AllClonesGQL extends Query<Response> {
    document = gql`
    query get_clones($template_dna: ID!) {
      allClones(template_dna: $template_dna) {
        parent_dna_hash
        properties
        cloned_dna_hash
      }
    }
  `;
  }