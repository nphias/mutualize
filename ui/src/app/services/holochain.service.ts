import { utf8Encode } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { environment } from '@environment';
//import { PubSub } from 'graphql-subscriptions'
import { AppSignalCb, AppWebsocket, CellId  } from '@holochain/conductor-api'

export enum ConnectionState{
  OPEN,
  CLOSED,
  CLOSING,
  CONNECTING
}

@Injectable({
  providedIn: "root"
})
export class HolochainService {
  protected hcConnection!: AppWebsocket //tsconfig: "allowSyntheticDefaultImports": true,
  protected cellId!: CellId //= [Buffer.from("g","utf8"),Buffer.from("g","utf8")]     //tsconfig: "allowSyntheticDefaultImports": true,
  protected signal! : AppSignalCb
  //pubsub: PubSub = new PubSub()

 // constructor(ws:AppWebsocket){
  //  this.hcConnection = ws
  //}

  get agentKeyByteArray_from_cell():Uint8Array{return this.cellId[1]}

  get HoloHashByteArray_from_cell():Uint8Array{return this.cellId[0]}


  async init(){ //called by the appModule at startup
        //this.pubsub.subscribe('username-set',()=>{console.log("hello")})
        if (!environment.mock){
          try{
            console.log("Connecting to holochain")
              await AppWebsocket.connect(environment.HOST_URL)
                /*signal => {
                  const payload = signal.data.payload;
                  if (payload.OfferReceived) {
                    store.storeOffer(payload.OfferReceived);
                  } else if (payload.OfferAccepted) {
                    store.storeTransaction(payload.OfferAccepted);
                  }
                })*/
                .then(async (connection)=>{
                this.hcConnection = connection
                const appInfo = await connection.appInfo({ installed_app_id: environment.APP_ID });
                this.cellId = appInfo.cell_data[0][0];
                console.log(appInfo.cell_data)
              })
          }catch(error){
              console.error("Holochain connection failed:")
              throw(error)
          }
        } else (
          console.log("you are in Mock mode.. no connections made!")
        )
    }

     call(zome:string, fnName:string, args:{}|null){
      //try{
        return this.hcConnection.callZome({
          cap: null as any,
          cell_id: this.cellId,
          zome_name: zome,
          fn_name: fnName,
          payload: args,
          provenance: this.cellId[1],
        })
      //}catch(ex){
      //  console.log(ex)
      //}
    }
  
    subscribe(event:string){
    //  return this.pubsub.asyncIterator(event)
    }

    getConnectionState(){
      return ConnectionState[this.hcConnection.client.socket.readyState]
      console.log(this.hcConnection.client.socket.readyState)
      console.log("open:",this.hcConnection.client.socket.OPEN)
      console.log("closed:",this.hcConnection.client.socket.CLOSED)
      console.log("closing:",this.hcConnection.client.socket.CLOSING)
      console.log("connecting:",this.hcConnection.client.socket.CONNECTING)
      
    }

}
