import { Injectable } from "@angular/core";
import { HolochainConnectionOptions, HolochainConnection } from '@uprtcl/holochain-provider';
import { environment } from '@environment';

export type Dictionary<T> = {
  [key: string]: T;
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
    const mynewadress = this.hcConnection.call(instanceId,"profiles",'get_my_address', {})
    console.log(mynewadress)
      return "lol" //newDNAhash
  }


}
