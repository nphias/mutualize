import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';


//export interface PropertyIn {
//  value: string
//}

//export interface Property {[key: string]: string}

export interface CloneIn {
  parent_dna_hash: string,
  properties: string
  cloned_dna_hash: string
}

@Injectable({
  providedIn: 'root',
})
export class RegisterCloneGQL extends Mutation {
  document = gql`
    mutation register_clone($clone: CloneIn!) {
      registerClone(clone: $clone)
    }
  `;
}