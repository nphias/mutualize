import {GraphQLError} from 'graphql'

const ZOME_NAME = "profiles"

export const resolvers_profile = {
  Query: {
    async allAgents(_, __, connection) {
      if (connection.state == 2)
        return new GraphQLError("Holochain is disconnected")
      const allAgents = await connection.call(ZOME_NAME,'get_all_agents', {});
      console.log(allAgents)
      return allAgents.map((agent) => ({
        id: agent.agent_id,
        username: agent.username,
      }));
    },
    async me(_, __, connection) {
      if (connection.state == 2)
        return new GraphQLError("Holochain is disconnected")
      const address = await connection.call(ZOME_NAME,'get_my_address', {});
      return { id: address };
    },
  },
  Me: {
    agent(parent) {
      return { id: parent.id };
    },
  },
  Agent: {
    id(parent) {
      return parent.id;
    },
    username(parent, _, connection ) {
      //const cachedAgent = cache['data'].data[parent.id];
      //if (cachedAgent && cachedAgent.username) return cachedAgent.username;
      if (connection.state == 2)
        return new GraphQLError("Holochain is disconnected")
      return connection.call(ZOME_NAME,'get_username', {
        agent_address: parent.id,
      });
    },
  },
  Mutation: {
    async setUsername(_,  {username}, connection ) {
      if (connection.state == 2)
        return new GraphQLError("Holochain is disconnected")
      const agent = await connection.call(ZOME_NAME,'set_username', { username });
      return {
        id: agent.agent_id,
        username,
      };
    },
    async deleteUsername(_, {}, connection) {
      if (connection.state == 2)
        return new GraphQLError("Holochain is disconnected")
      return connection.call(ZOME_NAME,'delete_my_username', {});
    }
  },
};