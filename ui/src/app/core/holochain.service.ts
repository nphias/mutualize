import { Injectable } from "@angular/core";
import { HolochainConnectionOptions, HolochainConnection } from '@uprtcl/holochain-provider';
import { environment } from '@environment';

export type Dictionary<T> = {
  [key: string]: T;
}

export interface cloneResult {
"success": boolean, 
"dna_hash": string 
}

export interface cellResult {
  "id": string, 
  "dna": string
  "agent":string 
  }

@Injectable({
  providedIn: "root"
})
export class HolochainService {
  private hcConnection: HolochainConnection
  private instanceList: cellResult[]
  private breadCrumbStack: string[] = []
  private CurrentInstanceID: string = environment.DEFAULT_INSTANCE

  async init(){
    const hash:string = environment.TEMPLATE_HASH
    const templateDict:Dictionary<string> = {[environment.TEMPLATE_HASH]:'../dist/dna.dna.json'}
    const connectOpts:HolochainConnectionOptions = {
      host: environment.HOST_URL, 
      devEnv: { templateDnasPaths: templateDict}
    }
    console.log(templateDict)
    this.hcConnection = new HolochainConnection(connectOpts)//{ host: environment.HOST_URL })
      try{
          await this.hcConnection.ready()//.then((result)=>{
        //  this.hcConnection.onSignal('offer-received', ({ transaction_address }) => {
         //   console.log("signal callback:",transaction_address)
         // })
            //this.hcConnection.onSignal()
          this.instanceList = await this.hcConnection.callAdmin('admin/instance/list',{}) // await this.getCells()
          this.breadCrumbStack.push(environment.DNA_ID)
          //sessionStorage.setItem("network","genesis")
            //get list of interfaces here to know which networks user has joined
            //kill all instances apart from genesis
      }catch(error){
          console.log("Holochain connection failed:"+error)
      }
  }

  get breadCrumbTrail(){ return this.breadCrumbStack }


 /* async cloneDNA(agentid:string, instanceId:string, properties:object ):Promise<string>{
    const instID = instanceId
    const newDNAhash = await this.hcConnection.cloneDna(agentid,
      "myNewDna",
      instanceId,
      environment.TEMPLATE_HASH,
      properties,
      (interfaces) => {return interfaces[0]} //we just want the websocket interface here
       // interfaces.find((iface) =>
     //     iface.instances.find((i) => i.id == instID)
       // )
    );
    //this should call the new instance
    const mynewaddress = this.hcConnection.call(instanceId,"profiles",'get_my_address', {})
    console.log(mynewaddress)
      return "lol" //newDNAhash
  }*/

  async cloneDna (
    newDnaId: string,
    properties: any,
  ): Promise<cloneResult> {

    const dnaResult = await this.hcConnection.callAdmin('admin/dna/install_from_file', {
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

  async startNetwork(newInstanceId:string){
    const runningInstances:cellResult[] = await this.hcConnection.callAdmin('admin/instance/running',{})
    if (!runningInstances.map(inst=>{return inst.id}).includes(newInstanceId)){
      const startResult = await this.hcConnection.callAdmin('admin/instance/start', { id: newInstanceId });
      console.log("start_result",startResult)
    }
    this.CurrentInstanceID = newInstanceId
    const dna_id = this.dna_from_instance(newInstanceId)
    if(dna_id)
      this.breadCrumbStack.push(dna_id.split("_")[0])
    console.log(this.breadCrumbStack.join("->"))
  }

  async getCells():Promise<string[]>{
    const list:string[] = []
    const instances:cellResult[] = await this.hcConnection.callAdmin('admin/instance/list',{})
    instances.forEach(inst => {list.push(inst.id)})
    return list
  }

  is_instanceMember(instanceID:string):boolean{
    let result = false
    this.instanceList.forEach(inst => {
      if(inst.id == instanceID)
        result = true
    })
    return result
  }

  dna_from_instance(instanceID:string):string {
    let result = null
    this.instanceList.forEach(inst => {
      if(inst.id == instanceID)
        result = inst.dna
    })
    return result
  }

  getConnectionState(){
    return this.hcConnection.state
  }

  async call(zome,fnt, args){
    return this.hcConnection.call(this.CurrentInstanceID,zome,fnt,args)
  }


}
