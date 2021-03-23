import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import {  AgentProfile, ProfilesService } from '../../../services/profiles.service'
//import { CreateOfferGQL } from 'src/app/graphql/transactor/queries/offer-mutations-gql';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProfilesStore } from "src/app/stores/profiles.store";
import { TransactorStore } from "src/app/stores/transactor.store";
import { PublicTransactorService } from "src/app/services/transactor.service";
//import { MyOffersGQL } from 'src/app/graphql/transactor/queries/myoffers-gql';

interface offerRow
{
  id:string,
  username:string,
  amount:number
} 

@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"]
})
export class UserListComponent implements OnInit {
  //agentlist$: Observable<AgentProfile[]>;
  errorMessage!:string
  userForm!: FormGroup
 // agentSubscription!: Subscription

  constructor(
  //  private agents: AllAgentsGQL, 
   // private offer: CreateOfferGQL,
   // private offers:MyOffersGQL,
    private transactionService: PublicTransactorService,
    private profilesService: ProfilesService,
    public p_store: ProfilesStore,
    private router: Router,
    private fb: FormBuilder
    ) { 
  }

  async ngOnInit() {
    this.userForm = this.fb.group({
      Rows : this.fb.array([])
    });
    try {
      this.profilesService.getAllProfiles()
      //this.agentlist$ = this.p_store.knownProfiles
      /// this could be done by piping keyvalue in the ngfor template
      //for (let key in this.p_store.profiles){
       // this.agentlist.push({agent_pub_key:key, profile:this.p_store.profiles[key]})
      //Object.values(this.p_store.profiles).map(profile =>{return profile..content})
     
     /* this.agentlist = this.agents.watch().valueChanges.pipe(map(result=>{
        if (!result.errors)
          return result.data.allAgents.map(agent => <Agent>{id:agent.id, username:agent.username})
        this.errorMessage = result.errors[0].message
        return null
      }))*/
    } catch(exception){
        console.log(exception)
        this.errorMessage = exception
    }
    //this.agentSubscription = this.agentlist.subscribe(agents => { this.populateForm(agents)})
  }

  ngOnDestroy(){
   // this.agentSubscription.unsubscribe()
  }

  get formArr() {
    return this.userForm.get("Rows") as FormArray;
  }

  setFormData(){
    console.log(this.p_store.knownProfiles)
    this.populateForm(this.p_store.knownProfiles)
  }

  populateForm(agentlist: AgentProfile[]){
    for (let i = 0; i < agentlist.length; i++ ) {
      if (agentlist[i].agent_pub_key != sessionStorage.getItem("userhash")){
        this.formArr.push(
          this.fb.group({
            id: this.fb.control(agentlist[i].agent_pub_key),
            username: this.fb.control(agentlist[i].profile.nickname),
            amount: this.fb.control(0)
          })
        )
      }
    }
  }

  async createOffer(data:offerRow){
    console.log(data)
    try {
      const result = await this.transactionService.createOffer(data.id,data.amount)
      console.log(result)
     // await this.offer.mutate({creditorId:data.id,amount:data.amount},{refetchQueries: [{query: this.offers.document}]})
      //.toPromise()//.then(result => {
      //console.log(result)
      this.router.navigate(["offers"]);
    //}).catch(ex=>{this.errorMessage = ex})
    } catch(exception){
      console.error(exception)
     // if ((exception as string).includes("Timeout"))
       // exception = "No reponse, the user is probably offline:"+exception
       this.errorMessage = "type:"+exception.data.type+" "+exception.data.data
       // console.log(exception)
       // this.errorMessage = exception
    }
  }
  

}
