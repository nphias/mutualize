import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AllAgentsGQL,Agent } from 'src/app/graphql/queries/all-agents-gql';
import { CreateOfferGQL } from 'src/app/graphql/queries/create-offer-gql';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"]
})
export class UserListComponent implements OnInit {
  agentlist: Observable<Agent[]>;
  errorMessage:string
  offerForm = this.fb.group({
    id: ["", Validators.required],
    username: ["", Validators.required],
    amount: ["", Validators.required]
  });

  constructor(private agents: AllAgentsGQL, 
    private offer: CreateOfferGQL, 
    private router: Router,
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    try {
      this.agentlist = this.agents.watch().valueChanges.pipe(map(result=>{
        if (!result.errors){
          //this.offerForm.setValue(''); 
          return result.data.allAgents.map(agent => <Agent>{id:agent.id, username:agent.username})
        }
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
  }

  createOffer(){
    const credid =  "HcScjN8wBwrn3tuyg89aab3a69xsIgdzmX5P9537BqQZ5A7TEZu7qCY4Xzzjhma" //this.offerForm.get("id").value
    const c_amount = 100 //this.offerForm.get("amount").value
    try {
      const result = this.offer.mutate({creditorId:credid,amount:c_amount})//.toPromise()//.then(()=>{
      console.log(result)
    } catch(exception){
        this.errorMessage = exception
    }
  }
  

}
