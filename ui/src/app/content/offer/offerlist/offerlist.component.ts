import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AllAgentsGQL,Agent } from 'src/app/graphql/queries/all-agents-gql';
import { MyOffersGQL,Offer } from 'src/app/graphql/queries/myoffers-gql';

@Component({
  selector: "app-offerlist",
  templateUrl: "./offerlist.component.html",
  styleUrls: ["./offerlist.component.css"]
})
export class OfferListComponent implements OnInit {
  pendingOffers: Observable<Offer[]>;
  agentlist: Observable<Agent[]>;
  errorMessage:string

  constructor(private agents: AllAgentsGQL, private offers:MyOffersGQL, private router: Router) {
  }

  ngOnInit() {
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
    try {
      this.pendingOffers = this.offers.watch().valueChanges.pipe(map(result=>{
        if (!result.errors)
          return result.data.offers.map(offer => <Offer>{id:offer.id, transaction:offer.transaction, counterparty:offer.counterparty, state:offer.state})
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
  }

  createOffer(){}
  

}
