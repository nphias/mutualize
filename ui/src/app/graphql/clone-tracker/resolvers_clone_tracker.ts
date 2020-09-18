import {GraphQLError} from 'graphql'

const ZOME_NAME = "cloned-dnas-tracker"

function checkConnection(connection){
  if (connection.state == 2)
  throw new GraphQLError("Holochain is disconnected")
}

export const resolvers_clone_tracker = {
  Query: {
    async allClones(_, {template_dna}, connection) {
      checkConnection(connection)
      const allClones = await connection.call(ZOME_NAME,'get_cloned_dnas_for_template', {template_dna});
      return allClones.map((clone) => ({
        parent_dna_hash: clone.template_dna_hash,
        properties: JSON.stringify(clone.properties),//Object.entries(clone.properties).map((property) => ({
          //name: property[0],
          //value: property[1]
        //})), 
        cloned_dna_hash: clone.cloned_dna_hash
      }));
    }
  },
  Mutation: {
    async registerClone(_,  {clone}, connection ) {
      checkConnection(connection)
      const cloned_dna = {
        template_dna_hash: clone.parent_dna_hash,
        properties: JSON.parse(clone.properties),//Object.assign({}, ...clone.properties),
        cloned_dna_hash: clone.cloned_dna_hash
      }
      return connection.call(ZOME_NAME,'register_cloned_dna', { cloned_dna });
    },
  },
};