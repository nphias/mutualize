import { Injectable } from "@angular/core";
import { environment } from '@environment';
import { HolochainService } from "./holochain.service";

export type Dictionary<T> = {
  [key: string]: T;
}

export interface CloneResult {
"success": boolean, 
"dna_hash": string 
}

export interface InstanceResult {
  "id": string, //dna_hash
  "dna": string //dna_id
  "agent":string 
}

export interface DnaClone {
  "id": string, //dna_hash
  "hash": string //dna_id
}

@Injectable({
  providedIn: "root"
})
export class NetworkService {
  private hcConnection: HolochainConnection
  private instanceList: InstanceResult[] = []
  private CurrentInstanceID: string = environment.TEMPLATE_HASH
  private breadCrumbStack: string[] = []

  constructor(private hcs:HolochainService) {  }
  
  get breadCrumbTrail(){ return this.breadCrumbStack }


  async cloneDna (
    newDnaId: string,
    properties: any,
  ): Promise<CloneResult> {

    const dnaResult = await this.hcs.hcConnection.callAdmin('admin/dna/install_from_file', {
      id: newDnaId,
      path: environment.TEMPLATE_FILE,
      properties,
      copy: true,
    });
    return dnaResult
  }

  async registerNetwork (
    agentId: string,
    newDnaId: string,
    newInstanceId: string,
    //templateDnaAddress: string,
    //properties: any,
    findInterface: (interfaces: Array<any>) => any
  ) : Promise<void> {
    const instanceResult = await this.hcConnection.callAdmin('admin/instance/add', {
      id: newInstanceId,
      agent_id: agentId,
      dna_id: newDnaId,
    })
    console.log("instance_add_result:",instanceResult)
    const interfaceList = await this.hcConnection.callAdmin('admin/interface/list', {});
    // TODO: review this: what interface to pick?
    const iface = findInterface(interfaceList);

    const ifaceResult = this.hcConnection.callAdmin('admin/interface/add_instance', {
      instance_id: newInstanceId,
      interface_id: iface.id,
    });
    console.log("ifaceResult:",ifaceResult)
    await new Promise((resolve) => setTimeout(() => resolve(), 300));
    this.instanceList = await this.hcConnection.callAdmin('admin/instance/list',{}) //if success we could manually add to instancelist without another backend call
    //await new Promise((resolve) => setTimeout(() => resolve(), 300));
    //const startResult = await this.hcConnection.callAdmin('admin/instance/start', { id: newInstanceId });
    //console.log("start_result",startResult)
  }

  //
  async startNetwork(newInstanceId:string){
    const runningInstances:InstanceResult[] = await this.hcConnection.callAdmin('admin/instance/running',{})
    if (!runningInstances.map(inst=>{return inst.id}).includes(newInstanceId)){
      const startResult = await this.hcConnection.callAdmin('admin/instance/start', { id: newInstanceId });
      console.log("start_result",startResult)
    }
    sessionStorage.setItem("parent_dna",newInstanceId)
    this.CurrentInstanceID = newInstanceId
    const dna_id = this.dna_id_from_instance_hash(newInstanceId)
    if(!dna_id)
      throw ("DNA_ID does not exist for instance:"+newInstanceId)
    this.breadCrumbStack.push(dna_id)
    console.log(this.breadCrumbStack.join("->"))
  }

  async cloneExists(dna_id):Promise<boolean>{
    let result = false
    const res:DnaClone[] = await this.hcConnection.callAdmin('admin/dna/list', {});
    res.forEach(clone=>{
      if(dna_id == clone.id)
        result = true
    })
    return result
  }

  changeToRunningNetwork(dna_id:string){
    const instanceId = this.instance_hash_from_dna_id(dna_id)
    sessionStorage.setItem("parent_dna",instanceId)
    this.CurrentInstanceID = instanceId
    const index = this.breadCrumbStack.indexOf(dna_id) + 1
    this.breadCrumbStack = this.breadCrumbStack.slice(0,index)
  }

  is_instanceMember(instanceID:string):boolean{
    let result = false
    this.instanceList.forEach(inst => {
      if(inst.id == instanceID)
        result = true
    })
    return result
  }

  dna_id_from_instance_hash(instanceHash:string):string {
    let result = null
    this.instanceList.forEach(inst => {
      if(inst.id == instanceHash)
        result = inst.dna
    })
    return result
  }

  instance_hash_from_dna_id(dna_id:string):string {
    let result = null
    this.instanceList.forEach(inst => {
      if(inst.dna == dna_id)
        result = inst.id
    })
    return result
  }

  getConnectionState(){
    return 2 //this.hcConnection.state
  }

  async call(zome,fnt, args){
    return null //this.hcConnection.call(this.CurrentInstanceID,zome,fnt,args)
  }

  
}