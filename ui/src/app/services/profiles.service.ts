import { HolochainService } from './holochain.service';
import { Injectable } from '@angular/core';

export type Dictionary<T> = { [key: string]: T };

export interface Profile {
  nickname: string;
  fields: Dictionary<string>;
}

export interface AgentProfile {
  agent_pub_key: string;
  profile: Profile;
}

@Injectable({
  providedIn: "root"
})
export class ProfilesService {
  public zomeName = 'profiles'

  constructor(private hcs:HolochainService) {  }

  get cell_agentKeyByteArray(){return this.hcs.agentKeyByteArray_from_cell};
  get cell_holoHashByteArray(){return this.hcs.HoloHashByteArray_from_cell}

  async getMyProfile(): Promise<AgentProfile> {
    return this.hcs.call(this.zomeName,'get_my_profile', null);
  }

  async getAgentProfile(agentPubKey: string): Promise<AgentProfile> {
    return this.hcs.call(this.zomeName,'get_agent_profile', agentPubKey);
  }

  async searchProfiles(nicknamePrefix: string): Promise<Array<AgentProfile>> {
    return this.hcs.call(this.zomeName,'search_profiles', {
      nickname_prefix: nicknamePrefix,
    });
  }

  async getAllProfiles(): Promise<Array<AgentProfile>> {
    return this.hcs.call(this.zomeName,'get_all_profiles', null);
  }

  async createProfile(profile: Profile): Promise<AgentProfile> {
    const profileResult = await this.hcs.call(this.zomeName,'create_profile', profile);

    return {
      agent_pub_key: profileResult.agent_pub_key,
      profile: profileResult.profile,
    };
  }
}
