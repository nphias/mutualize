import { Component, OnInit } from "@angular/core";
import { Observable,Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AllAgentsGQL,Agent } from 'src/app/graphql/queries/all-agents-gql';
import { MyOffersGQL,Offer } from 'src/app/graphql/queries/myoffers-gql';
import { ValidateOfferGQL } from 'src/app/graphql/queries/validate-offer-gql';
import { AcceptOfferGQL,ConsentOfferGQL,CancelOfferGQL } from 'src/app/graphql/queries/offer-mutations-gql';


@Component({
  selector: "app-offerlist",
  templateUrl: "./offerlist.component.html",
  styleUrls: ["./offerlist.component.css"]
})
export class OfferListComponent implements OnInit {
  pendingOffers: Observable<Offer[]>;
  validOffer: Observable<Offer>;
  offerSubscription: Subscription
  //agentlist: Observable<Agent[]>;
  errorMessage:string

  constructor(private agents: AllAgentsGQL, private offers:MyOffersGQL, private validate:ValidateOfferGQL, private accept:AcceptOfferGQL, private consent:ConsentOfferGQL, private cancel:CancelOfferGQL, private router: Router) {
  }

  ngOnInit() {
    try {
      this.pendingOffers = this.offers.watch().valueChanges.pipe(map(result=>{
        if (!result.errors)
          return result.data.offers.map(offer => <Offer>{id:offer.id, transaction:offer.transaction, state:offer.state})
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
  }

  ngOnDestroy(){
    if (this.offerSubscription)
    this.offerSubscription.unsubscribe()
  }

  acceptOffer(transactID:string){
    try {
      this.validOffer = this.validate.watch({transactionId:transactID}).valueChanges.pipe(map(result=>{
        if (!result.errors){
          console.log(result.data.offer)
          return result.data.offer
         } //.map(offer => <Offer>{id:offer.id, transaction:offer.transaction, counterparty:offer.counterparty, state:offer.state})
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
    this.offerSubscription = this.validOffer.subscribe(offerDetail=>{ 
      if (offerDetail.counterparty.snapshot)
        this.markAccepted(offerDetail.id, offerDetail.counterparty.snapshot.lastHeaderId)
      else
        console.log("consent failed?")
    })
  }

 verifyOffer(transactID:string){
    try {
      this.consent.mutate({transactionId:transactID}).toPromise().then(result=>{
        console.log(result)
      }).catch(ex=>{this.errorMessage = ex})
    } catch(exception){
        this.errorMessage = exception
    }
  }

  markAccepted(transactID:string, header_address:string){
    try {
      this.accept.mutate({transactionId:transactID,approvedHeaderId:header_address}).toPromise().then(result=>{
        console.log(result)
      }).catch(ex=>{this.errorMessage = ex})
    } catch(exception){
        this.errorMessage = exception
    }
  }

  cancelOffer(transactID:string){
    try {
      this.cancel.mutate({transactionId:transactID}).toPromise().then(result=>{
        console.log(result)
      }).catch(ex=>{this.errorMessage = ex})
    } catch(exception){
        this.errorMessage = exception
    }
  }


}
