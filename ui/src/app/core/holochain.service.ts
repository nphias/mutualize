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

@Injectable({
  providedIn: "root"
})
export class HolochainService {
  hcConnection: HolochainConnection

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
      }catch(error){
          console.log("Holochain connection failed:"+error)
      }
  }

  async cloneDNA(agentid:string, instanceId:string, properties:object ):Promise<string>{
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
  }

  async cloneDna(
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

  async changeNetwork (
    agentId: string,
    newDnaId: string,
    newInstanceId: string,
    templateDnaAddress: string,
    properties: any,
    findInterface: (interfaces: Array<any>) => any
  ) : Promise<void> {
    const instanceResult = await this.hcConnection.callAdmin('admin/instance/add', {
      id: newInstanceId,
      agent_id: agentId,
      dna_id: newDnaId,
    });

    const interfaceList = await this.hcConnection.callAdmin('admin/interface/list', {});
    // TODO: review this: what interface to pick?
    const iface = findInterface(interfaceList);

    const ifaceResult = this.hcConnection.callAdmin('admin/interface/add_instance', {
      instance_id: newInstanceId,
      interface_id: iface.id,
    });

    await new Promise((resolve) => setTimeout(() => resolve(), 300));
    const startResult = await this.hcConnection.callAdmin('admin/instance/start', { id: newInstanceId });
  }


}
