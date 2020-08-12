import { Injectable } from "@angular/core";
import { HolochainConnection } from '@uprtcl/holochain-provider';
import { environment } from '@environment';

@Injectable({
  providedIn: "root"
})
export class HolochainService {
  hcConnection: HolochainConnection

  async init(){
    this.hcConnection = new HolochainConnection({
        host: environment.HOST_URL
        })
        try{
            await this.hcConnection.ready()//.then((result)=>{
           // this.hcConnection.onSignal('offer-received', ({ transaction_address }) => {
             // console.log("signal callback:",transaction_address)
            //})
              //this.hcConnection.onSignal()
        }catch(error){
            console.log("Holochain connection failed:"+error)
        }
    }

}
