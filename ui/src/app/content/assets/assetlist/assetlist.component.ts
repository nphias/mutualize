import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AllAgentsGQL,Agent } from 'src/app/graphql/queries/all-agents-gql';
import { CreateOfferGQL } from 'src/app/graphql/queries/offer-mutations-gql';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HolochainService } from 'src/app/core/holochain.service'

interface offerRow
{
  id:string,
  username:string,
  amount:number
} 

@Component({
  selector: "app-assetlist",
  templateUrl: "./assetlist.component.html",
  styleUrls: ["./assetlist.component.css"]
})
export class AssetListComponent implements OnInit {
  agentlist: Observable<Agent[]>;
  errorMessage:string
  userForm: FormGroup
  agentSubscription: Subscription

  constructor(
    private agents: AllAgentsGQL, 
    private offer: CreateOfferGQL, 
    private router: Router,
    private fb: FormBuilder,
    private hcs: HolochainService
    ) { 
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      Rows : this.fb.array([])
    });
    try {
      this.agentlist = this.agents.watch().valueChanges.pipe(map(result=>{
        if (!result.errors)
          return result.data.allAgents.map(agent => <Agent>{id:agent.id, username:agent.username})
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
    this.agentSubscription = this.agentlist.subscribe(agents => { this.populateForm(agents)})
  }

  ngOnDestroy(){
    this.agentSubscription.unsubscribe()
  }

  get formArr() {
    return this.userForm.get("Rows") as FormArray;
  }

  populateForm(agentlist: Agent[]){
    for (let i = 0; i < agentlist.length; i++ ) {
      if (agentlist[i].id != sessionStorage.getItem("userhash")){
        this.formArr.push(
          this.fb.group({
            id: this.fb.control(agentlist[i].id),
            username: this.fb.control(agentlist[i].username),
            amount: this.fb.control(0)
          })
        )
      }
    }
  }

  createOffer(data:offerRow){
    console.log(data)
    try {
      const result = this.offer.mutate({creditorId:data.id,amount:data.amount}).toPromise().then(result => {
      console.log(result)
      this.router.navigate(["offers"]);
    })
    } catch(exception){
        this.errorMessage = exception
    }
  }
//static now for testing
  createAsset(data:offerRow){
    this.hcs.cloneDNA( 
      "mutual-agent",//sessionStorage.getItem("userhash"),
      "new_mutual_instance", //data.id+"_instance",
      {name:"interstellar", unit_of_account:"km"}
      //{name:data.username, unit_of_account:data.amount}
    );
  }
  

}